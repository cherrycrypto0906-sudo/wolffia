# Deploy Notes For VPS

## Stack
- Frontend: React 19 + Vite
- Server: Node.js + Express
- Admin route: `/admin`
- API routes: served from `api/` via `server.js`

This project is not static HTML. It already has a Node/Express server and an admin UI, so no extra Express wrapper was needed.

## Required .env Variables On VPS
Create `/path/to/project/.env` on the VPS with values for:

```env
PORT=3000
GEMINI_API_KEY=""
RESEND_API_KEY=""
OPENROUTER_API_KEY=""
FORM_DESTINATION=""
DATABASE_URL=""
ADMIN_PASSWORD=""
```

Notes:
- `GEMINI_API_KEY` is required by `api/chat.js`
- `RESEND_API_KEY` is required by the Resend email endpoints
- `FORM_DESTINATION` is the Google Apps Script endpoint used by admin/order APIs
- `OPENROUTER_API_KEY` is present in env files but appears unused right now
- `DATABASE_URL` and `ADMIN_PASSWORD` are placeholders for future/adjacent admin features
- `ADMIN_PASSWORD` is now required for the in-app `/admin` login and to protect `/api/admin-db`
- Set `NODE_ENV=production` in PM2, systemd, or the shell command that starts Node rather than inside Vite-loaded `.env`

## Commands To Run On VPS
```bash
npm install
npm run build
npm run start
```

## PM2 Example
```bash
npm install -g pm2
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Listening Port
- The server listens on: `process.env.PORT || 3000`
- Default port if `.env` is missing `PORT`: `3000`

## Production URLs
- Main site: `https://wolffia.io.vn`
- Admin: `https://wolffia.io.vn/admin`
- Health check: `https://wolffia.io.vn/health`

## VPS Paths
- App directory: `/opt/my-website`
- Service file: `/etc/systemd/system/mywebsite.service`
- Deploy script: `/usr/local/bin/deploy-mywebsite.sh`
- Backup script: `/usr/local/bin/backup-brain-db.sh`
- Backup directory: `/opt/my-website/backups`

## Operations
- Deploy latest code:
```bash
/usr/local/bin/deploy-mywebsite.sh
```

- Check service status:
```bash
systemctl status mywebsite
```

- Restart app:
```bash
systemctl restart mywebsite
```

- Tail app logs:
```bash
journalctl -u mywebsite -f
```

- Test health endpoint:
```bash
curl https://wolffia.io.vn/health
```

- Manual backup:
```bash
/usr/local/bin/backup-brain-db.sh
```

## Admin Protection
- `/admin` is protected at the application layer by the in-app password screen
- Admin session is backed by `ADMIN_PASSWORD`
- Nginx no longer uses basic auth for `/admin`, so users only log in once

## Backup Policy
- `brain.db` is backed up daily at `02:00`
- Backups older than `14` days are deleted automatically
- Backup log file:
```bash
/var/log/backup-brain-db.log
```

## Git / Secrets Hygiene
- Do not commit `.env`
- Do not commit `brain.db` or any nested `brain.db`
- Secrets were moved to env-backed access for production deploy
