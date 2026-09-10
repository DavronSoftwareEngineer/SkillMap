import type { Module } from '../../types';
import { ENGINEERING_TRACKS } from './engineering';
import { DELIVERY_TRACKS } from './delivery';
import { LANGUAGE_TRACKS } from './languages';
import { BUSINESS_TRACKS } from './business';
import { SYSTEM_DESIGN_TRACK } from './system-design';
import type { LearningTrack } from './types';
import { MODULE_WORKSHOPS } from './module-workshops';
import { applyCorporateLearning } from './corporate-platform';

export const LEARNING_TRACKS: Record<string, LearningTrack> = {
  ...ENGINEERING_TRACKS, ...DELIVERY_TRACKS, ...LANGUAGE_TRACKS,
  ...BUSINESS_TRACKS, systemdesign: SYSTEM_DESIGN_TRACK,
};

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

export function applyLearningQuality(courseId: string, modules: Module[]): Module[] {
  const track = LEARNING_TRACKS[courseId];
  if (!track) return modules;
  return modules.map((module, index) => {
    const learningCases = track.cases.filter(item => item.modules[0] === module.zoom);
    const owned = learningCases.filter(item => item.modules[0] === module.zoom);
    const introduction = index === 0 ? `<h3>O‘quv yo‘li: poydevordan mustaqil ishga</h3><p>${escape(track.scope)}</p><p><strong>Kirish talabi:</strong> ${escape(track.prerequisite)}</p><p>Har bosqich: ishlangan misol → yordamli mashq → boshqa shartdagi mustaqil ish → mezon bo‘yicha review → 1 va 7 kundan keyin qayta eslash. Har modulda o‘ziga xos amaliyot bor. Katta case o‘zining boshlang‘ich modulida ochiladi; quyidagi havolalar orqali unga qaytish mumkin.</p><ol>${track.cases.map(item => `<li><a href="#${courseId}/${encodeURIComponent(item.modules[0])}">${escape(item.title)}</a></li>`).join('')}</ol><p><strong>Finalga olib boring:</strong> ${escape(track.finalEvidence)}</p><p>Checkbox yoki test balli mustaqil malaka sertifikati emas. Final revieweriga birinchi urinish, tuzatish va natija dalilini ko‘rsating.</p>` : '';
    return applyCorporateLearning(courseId, {
      ...module,
      workshop: MODULE_WORKSHOPS[courseId]?.[module.zoom],
      doc: introduction + module.doc,
      learningCases,
      tasks: [...module.tasks, ...(['founder','systemdesign'].includes(courseId) ? [] : [{
        id: `workshop-${module.zoom}`,
        html: 'Modul mashqini yangi shart bilan mustaqil bajardim',
        crit: MODULE_WORKSHOPS[courseId]?.[module.zoom]?.acceptance || '',
      }]), ...owned.map(item => ({
        id: `practice-${item.id}`,
        html: `${escape(item.title)}: mustaqil transfer topshirig‘i`,
        crit: `${item.transfer} Qabul mezonlari: ${item.rubric.join(' ')}`,
      }))],
      resources: index === 0 ? [...module.resources, ...track.sources.filter(source => !module.resources.some(r => r.url === source.url)).map(source => ({
        type: 'doc' as const, url: source.url, title: source.title,
        desc: 'Amaliy yo‘l uchun asosiy manba. Mahsulot hujjati versiyasini ishlatayotgan muhitingiz bilan tekshiring.',
        host: new URL(source.url).hostname,
      }))] : module.resources,
    });
  });
}
