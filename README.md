# Portfolio Web (Vue + Firestore + Admin API)

Performance-first portfolio with:
- Public landing page
- Projects page (category tabs, all published projects)
- Certificates page (image preview, issuer, year, verification link)
- Admin dashboard (`/admin`) with Firebase Auth login
- Secure admin API in `server/server.js` using Firebase Admin SDK + Firestore

## Tech stack
- Frontend: Vue 3 + Vite + Vue Router
- Data: Cloud Firestore
- Auth: Firebase Authentication
- Admin API: Express + Firebase Admin SDK

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
VITE_API_BASE_URL=http://localhost:3001
```

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

Deploy after setup:

```sh
firebase deploy --only firestore:rules,firestore:indexes
```
# Fast-Porto
