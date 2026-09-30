import { useEffect, useRef, useState } from 'react';
import { readCloudData, restoreCloudData } from '../lib/cloud-storage';
import { validCloudData } from '../lib/cloud-data';
import type { CloudData } from '../lib/cloud-data';
import { SAVED_EVENT, RESTORED_EVENT } from '../lib/storage';
import { downloadBackup } from '../lib/backup';
interface User { id: string; username: string }
interface Snapshot { user: User; revision: number; updatedAt: string; data: CloudData }
async function api(path: string, method = 'GET', data?: unknown) {
  const response = await fetch('/sync' + path, { method, credentials: 'same-origin', cache: 'no-store',
    headers: data ? { 'Content-Type': 'application/json' } : undefined, body: data ? JSON.stringify(data) : undefined });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Cloud backend hali ulanmagan. Netlify sozlamalarini tugatish kerak.');
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Cloud so‘rovi bajarilmadi.');
  return result;
}
function snapshot(value: Snapshot, owner: User): Snapshot {
  if (value.user?.id !== owner.id) throw new Error('Hisob boshqa oynada almashgan. Chiqib, qayta kiring.');
  if (!Number.isSafeInteger(value.revision) || value.revision < 0 || !validCloudData(value.data)) throw new Error('Cloud javobi noto‘g‘ri.');
  return value;
}
export function CloudAccount() {
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [remote, setRemote] = useState<Snapshot | null>(null);
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Progress avval brauzerda saqlanadi. Cloud tugmalar orqali yangilanadi.');
  const [changed, setChanged] = useState(false);
  const checked = useRef(false); const lock = useRef(false); const previewLocal = useRef('');
  useEffect(() => {
    const dirty = () => setChanged(true);
    window.addEventListener(SAVED_EVENT, dirty); window.addEventListener(RESTORED_EVENT, dirty); window.addEventListener('storage', dirty);
    return () => { window.removeEventListener(SAVED_EVENT, dirty); window.removeEventListener(RESTORED_EVENT, dirty); window.removeEventListener('storage', dirty); };
  }, []);
  async function run(action: () => Promise<void>) {
    if (lock.current) return; lock.current = true; setBusy(true);
    try { await action(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Cloud bilan aloqa bo‘lmadi.'); }
    finally { lock.current = false; setBusy(false); }
  }
  const fetchSnapshot = async (owner: User) => {
    const result = snapshot(await api('/progress'), owner);
    setRemote(result); previewLocal.current = JSON.stringify(readCloudData()); return result;
  };
  useEffect(() => {
    if (!opened || checked.current) return; checked.current = true;
    void run(async () => {
      const result = await api('/me'); setUser(result.user); await fetchSnapshot(result.user);
      setMessage('Hisob ochildi. Cloud nusxani ko‘rib, saqlash yoki tiklashni tanlang.');
    });
  }, [opened]);
  return <details className="cloud-account" onToggle={event => setOpened(event.currentTarget.open)}>
    <summary>Hisob va cloud {user ? '— ' + user.username : ''}</summary>
    <section aria-label="Hisob va cloud">
      <p>Login va progress bazada saqlanadi. AI API kalitlari cloudga yuborilmaydi. Qo‘lda kiritilgan baholar tekshirilgan natija hisoblanmaydi.</p>
      <fieldset disabled={busy}>
        {!user ? <form onSubmit={event => { event.preventDefault(); void run(async () => {
          const result = await api(register ? '/register' : '/login', 'POST', { username, password });
          setPassword(''); setUser(result.user); await fetchSnapshot(result.user);
          setMessage('Hisobga kirdingiz. Bu brauzer progressini cloudga saqlash uchun tugmani bosing.');
        }); }}>
          <label>Login<input required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_]+" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
          <label>Parol (kamida 12 belgi)<input required type="password" minLength={12} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button type="submit">{register ? 'Hisob yaratish' : 'Kirish'}</button>
          <button type="button" onClick={() => setRegister(v => !v)}>{register ? 'Menda hisob bor' : 'Yangi hisob'}</button>
          <p>Parolingizni xavfsiz joyda saqlang. Email orqali parol tiklash hozir mavjud emas.</p>
        </form> : <>
          <p>Cloud nusxa: {remote ? 'v' + remote.revision + ' · ' + new Date(remote.updatedAt).toLocaleString() + ' · ' + Object.keys(remote.data).length + ' ta bo‘lim' : 'yuklanmagan'}</p>
          {changed && <p>Mahalliy o‘zgarishlar bor. Cloudga saqlash tugmasini bosing.</p>}
          <button type="button" onClick={() => void run(async () => {
            await fetchSnapshot(user); setMessage('Cloud nusxa yangilandi. Tiklash bu brauzerdagi progress va qaydlarni almashtiradi; avval JSON zaxira oling.');
          })}>Cloud nusxani yangilash</button>
          <button type="button" disabled={!remote} onClick={() => void run(async () => {
            const data = readCloudData();
            const result = snapshot(await api('/progress', 'PUT', { accountId: user.id, revision: remote!.revision, data }), user);
            setRemote(result); const same = JSON.stringify(readCloudData()) === JSON.stringify(data); setChanged(!same);
            setMessage(same ? 'Progress cloudga saqlandi.' : 'Nusxa saqlandi. Saqlash paytidagi yangi o‘zgarishlar uchun yana saqlang.');
          })}>Bu brauzerni cloudga saqlash</button>
          <button type="button" onClick={() => downloadBackup(new Date())}>Avval JSON zaxira olish</button>
          <button type="button" disabled={!remote} onClick={() => void run(async () => {
            if (JSON.stringify(readCloudData()) !== previewLocal.current) throw new Error('Brauzer progressi o‘zgardi. Avval zaxira oling va cloud nusxani yangilang.');
            const before = previewLocal.current; const latest = snapshot(await api('/progress'), user);
            if (latest.revision !== remote!.revision) { setRemote(latest); throw new Error('Cloud nusxa o‘zgardi. Yangilangan nusxani ko‘rib, qayta tiklang.'); }
            if (JSON.stringify(readCloudData()) !== before) throw new Error('Tiklash paytida mahalliy progress o‘zgardi. Qayta urinib ko‘ring.');
            restoreCloudData(latest.data); previewLocal.current = JSON.stringify(readCloudData()); setChanged(false);
            setMessage('Cloud nusxa tiklandi. Oldingi nusxa brauzerda recovery sifatida saqlandi.');
          })}>Cloud bilan bu brauzerni almashtirish</button>
          <p>Tiklash barcha kurslardagi progress va qaydlarni cloud nusxa bilan almashtiradi.</p>
          <button type="button" onClick={() => void run(async () => {
            await api('/logout', 'POST'); setUser(null); setRemote(null); setPassword(''); setMessage('Hisobdan chiqdingiz. Progress bu brauzerda qoladi.');
          })}>Hisobdan chiqish</button>
          <details><summary>Parol va hisob sozlamalari</summary>
            <label>Joriy parol<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
            <label>Yangi parol<input type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></label>
            <button type="button" onClick={() => void run(async () => {
              await api('/password', 'POST', { accountId: user.id, password, newPassword }); setUser(null); setRemote(null); setPassword(''); setNewPassword('');
              setMessage('Parol yangilandi. Barcha qurilmalarda qayta kirish kerak.');
            })}>Parolni almashtirish</button>
            <label>Hisobni o‘chirish uchun loginni yozing<input value={deleteName} onChange={e => setDeleteName(e.target.value)} /></label>
            <p>Hisobni o‘chirish cloud ma’lumotlarini ham o‘chiradi. Avval JSON zaxira oling.</p>
            <button type="button" disabled={deleteName !== user.username} onClick={() => void run(async () => {
              await api('/account', 'DELETE', { accountId: user.id, password }); setUser(null); setRemote(null); setPassword(''); setDeleteName('');
              setMessage('Hisob va cloud ma’lumotlar o‘chirildi. Mahalliy progress saqlandi.');
            })}>Hisob va cloudni o‘chirish</button>
          </details>
        </>}
      </fieldset>
      <p role="status" aria-live="polite">{busy ? 'Cloud bilan ishlanmoqda…' : message}</p>
    </section>
  </details>;
}
