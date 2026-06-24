# King Clean Frontend

Production-oriented Arabic RTL frontend for the King Clean public website and admin command center.

## Local development

```powershell
npm install
npm run dev
```

The frontend expects the backend API origin at `http://localhost:5048`. Override it in `.env.local`:

```text
VITE_API_BASE_URL=http://localhost:5048
```

The API client appends `/api` internally, so requests go to URLs such as `http://localhost:5048/api/settings`.

## Full local stack

Backend URL: `http://localhost:5048`

Frontend URL: `http://localhost:5173`

Required frontend env:

```text
VITE_API_BASE_URL=http://localhost:5048
```

Run the backend from `../backend`:

```powershell
dotnet run --project src/KingClean.Api
```

Run the frontend from this folder:

```powershell
npm run dev
```

Check the backend directly:

```powershell
Invoke-RestMethod http://localhost:5048/api/health
```

## Validation

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

## Admin authentication

Admin sessions are stored in `sessionStorage` and expire using the `expiresAt` value returned by the backend. Configure a development admin through backend environment variables as documented in the backend README; no credentials are committed here.

## Client authentication

Client sessions are stored separately from admin sessions in `sessionStorage`:

- Admin: `king-clean-admin-session:v1`
- Client: `king-clean-client-session:v1`

Client routes:

- Register: `http://localhost:5173/client/register`
- Login: `http://localhost:5173/client/login`
- Account dashboard: `http://localhost:5173/client`
- My requests: `http://localhost:5173/client/requests`

Client registration accepts Gmail addresses only. The backend owns the email confirmation page at `GET /api/client/auth/confirm-email?token=...`; the frontend shows instructions and supports resending confirmation links, but it does not fake confirmation or auto-login before the email is confirmed.

## Upload storage

The frontend never calls Bunny Storage directly. Admin uploads still use:

- `POST /api/admin/uploads`
- `GET /api/admin/uploads/{id}`
- `DELETE /api/admin/uploads/{id}`

Use `publicUrl` in content/image/video fields. `storageObjectKey` is displayed for Bunny-backed storage, while `googleFileId` remains a legacy compatibility alias.
