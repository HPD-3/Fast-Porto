# Portfolio Web (Vue + Firestore + Admin API + Supabase Storage)

Performance-first portfolio with:
- Public landing page
- Projects page (category tabs, all published projects)
- Certificates page (image preview, issuer, year, verification link)
- Admin dashboard (`/admin`) with Firebase Auth login
- Image uploads stored in Supabase Storage public buckets
- Secure admin API in `server/server.js` using Firebase Admin SDK + Firestore

## Tech stack
- Frontend: Vue 3 + Vite + Vue Router
- Data: Cloud Firestore
- Auth: Firebase Authentication
- Admin API: Express + Firebase Admin SDK
- Image storage: Supabase Storage

## Public routes
- `/` landing page
- `/projects` project list with category tabs
- `/projects/:id` project detail page by ID
- `/certificates` certificate gallery

## Admin route
- `/admin` login and content management

Admin write operations call API endpoints and require Firebase ID token with `admin: true` custom claim.

## Environment variables (frontend)
Create `.env` in project root:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_STORAGE_BUCKET=...
VITE_API_BASE_URL=http://localhost:3001
```

Important: do not hardcode Firebase values in source files. Keep them only in environment variables so they are not embedded as fallback literals in deployed JS.

## Environment variables (server)
Set this variable for `server/server.js`:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
PORT=3001
```

`FIREBASE_SERVICE_ACCOUNT` must be a valid JSON string of your service account key.

## Firestore collections
- `projects/{id}`
  - `title`, `summary`, `category`, `imageUrl`, `projectUrl`, `repoUrl`, `techStack[]`, `featured`, `status`
- `certificates/{id}`
  - `title`, `issuer`, `year`, `imageUrl`, `verifyUrl`, `status`

Use `status: "published"` to show items on public pages.

## Image upload
- Admin image file uploads now go to Supabase Storage.
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_STORAGE_BUCKET` in `.env`.
- Uploaded public image URL is saved into Firestore `imageUrl`.
- Use a public Supabase bucket for the fastest browser delivery.

## API endpoints
- Public
  - `GET /api/public/projects`
  - `GET /api/public/certificates`
- Admin (requires bearer ID token with admin claim)
  - `POST /api/admin/projects`
  - `PUT /api/admin/projects/:id`
  - `DELETE /api/admin/projects/:id`
  - `POST /api/admin/certificates`
  - `PUT /api/admin/certificates/:id`
  - `DELETE /api/admin/certificates/:id`

## Run locally
Frontend:

```sh
npm install
npm run dev
```

Server:

```sh
cd server
npm install
npm run dev
```

## Firebase rules and indexes
- Rules: `firestore.rules`
- Indexes: `firestore.indexes.json`
- Storage rules: `storage.rules`

Deploy after setup:

```sh
firebase deploy --only firestore:rules,firestore:indexes,storage
```
# Fast-Porto
