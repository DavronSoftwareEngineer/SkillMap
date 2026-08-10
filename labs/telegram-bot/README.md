# Telegram Production Lab

Telegram kursining executable companion'i. Bu starter webhook secret, duplicate update va Mini App
negative-test contractlarini ko'rsatadi. U haqiqiy grammY bot, database persistence, queue yoki
Mini App HMAC verification tayyor deb da'vo qilmaydi — bular quyidagi evidence milestone'lardir.

```bash
cd labs/telegram-bot/api
npm test

cd ..
cp .env.example .env
docker compose up --build --wait
curl http://localhost:8091/health/live
docker compose down --volumes
```

## Keyingi milestone'lar

1. grammY handler va Telegram `update_id`ni PostgreSQL unique constraint bilan persist qilish.
2. Rasmiy Mini App initData HMAC verification va expired/tampered integration test.
3. Redis queue, Telegram 429 `retry_after`, bounded retry va dead-letter/recovery test.
4. Bot token/secrets management, structured logs, traces, backup/restore hamda CI deploy evidence.
