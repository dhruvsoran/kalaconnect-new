# KalaConnect API Documentation

Complete reference for all HTTP endpoints served by the Next.js App Router (`src/app/api/**`), backed by MongoDB (`src/lib/mongodb.ts`).

- **Base URL:** `https://www.kalaconnect.me` (production), `http://localhost:3000` (dev)
- **Content type:** `application/json` (except redirects/HTML)
- **CORS/middleware** (`src/middleware.ts`): rejects cross-origin `POST/PUT/DELETE` from unknown origins; sets `_csrf` cookie on `/login` and `/register`; adds `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`. Matcher: `/login`, `/register`, `/api/:path*`.

---

## 1. Authentication model

### 1.1 Token (JWT)
- Format: **JWT, HS256, payload `{ sub: userId, email }`, 7-day expiry**, signed with `JWT_SECRET` (`src/lib/jwt.ts`).
- Stateless: no server session, no token rotation. Any device can hold its own valid token.
- Role is **never embedded in the JWT** — always read live from MongoDB. A role switch takes effect on the next `/api/auth/me` call.

### 1.2 Two tokens-in, one identity out
| Channel | Used by | How it reaches the server | How it was obtained |
|---|---|---|---|
| **Bearer token** | Email/password users | `Authorization: Bearer <token>` header, token kept in **localStorage** | Returned in the JSON **response body** of `POST /api/auth/register` and `POST /api/auth/login` |
| **httpOnly cookie** | Google OAuth + email-verification auto-login | `Cookie: auth_token=…` (httpOnly, SameSite=Lax, 7d) — client can't read it | Set by `GET /api/auth/google/callback` / `GET /api/auth/verify-email` |

`GET /api/auth/me` accepts **either** channel: Bearer header first, else the `auth_token` cookie. When only the cookie is present it also returns a fresh Bearer token in the JS response so cookie users can adopt the localStorage flow (needed for role switching etc.).

### 1.3 Client sessionStorage
| Key | Meaning |
|---|---|
| `token` | JWT used in `Authorization: Bearer` |
| `isLoggedIn` | `'true'` convenience flag |
| `userId`, `userEmail`, `userName`, `userRole` | Snapshot for instant UI; source of truth = `/api/auth/me` |

The `AuthProvider` (`src/auth/auth-context.tsx`) refetches `/api/auth/me` on the `auth-change` window event and on mount; this is the single source of truth for all `useUser()` subscribers (header, dashboard, etc.).

### 1.4 CSRF
`POST /api/auth/login` requires header `x-csrf-token` matching the `_csrf` cookie the middleware sets on page load. The login page reads the cookie client-side and sends the header. Same-origin requests without the header are rejected with `400 CSRF token missing`.

---

## 2. Interview-friendly login flow (email/password)

1. User opens `/login` → browser loads page → **middleware sets `_csrf` cookie** → page reads it into state.
2. User submits → `POST /api/auth/login` with `x-csrf-token` header + `{ email, password }` body.
3. Server: rate-limit check (`login:{ip}:{email}`, 5 attempts) → find user by lowercased email → `verifyPassword` (bcrypt) → 403 if unverified → sign JWT.
4. Response **JSON body**: `{ token, user: { id, email, name, role, emailVerified } }`. **The token is not in a header or set-cookie — inspect the "Response" tab/body of the request in DevTools.**
5. Client (`src/app/login/page.tsx`) stores `token`, `isLoggedIn`, `userId`, `userRole` in localStorage, dispatches `auth-change`, redirects to `/dashboard` (or `/admin` for admins).
6. `AuthProvider` hears `auth-change` → `GET /api/auth/me` with `Authorization: Bearer` → server re-verifies JWT, loads the user **fresh from MongoDB** (role, profile fields) → all header/dashboard UI updates.
7. Every subsequent authenticated request sends the Bearer header (e.g. `GET /api/db/carts`, `POST /api/auth/role`).

> **Why you might "see nothing" in the Network tab:** there are intentionally **no cookies or auth headers on the login response** (cookie auth only exists for Google/verification flows). The token lives in the login response JSON body and later in the `Authorization` header of follow-up API calls and in localStorage under `token`.

**Logout flow:** `POST /api/auth/logout` clears the `auth_token`/`user_info` cookies → client clears the localStorage keys → `auth-change` → `/api/auth/me` returns `{ user: null }` → context clears state → UI flips instantly.

---

## 3. Auth endpoints

Base path: `/api/auth`

### 3.1 POST `/api/auth/register`
Create an account + send verification email.
- **Auth:** public.
- **Body:** `{ email, password, name?, role? }` — `role` ∈ `buyer | artisan` (default `buyer`; validated server-side against an allowlist).
- **Validation:** email format, password strength (`src/lib/password-validation.ts`: 8+ chars, upper+lower+number+special), name sanitized.
- **Responses:**
  - `200` `{ message, needsVerification: true, token, user }` — token already issued (login works after verification).
  - `200` `{ message: 'If the email is available, a verification link has been sent…' }` — *paused behavior*: currently unused; see duplicate handling below.
  - `409` `{ error: 'This email is already registered. Please log in or reset your password.', alreadyRegistered: true }`
  - `400` missing/invalid fields or weak password (`{ error, requirements }`)
  - `429` rate limit (`register:{ip}`, 5/hour)
- **Side effects:** user inserted with `emailVerified: false`; unique index on `users.email` (case-insensitive); verification token (32-byte, 24h, single per user) in `verificationTokens`; email via Resend.
- **Notes:** email is lowercased; inputs sanitized. Rate limiting via `src/lib/rate-limit.ts` (fixed window).

### 3.2 POST `/api/auth/login`
- **Auth:** public + **CSRF header required** (`x-csrf-token`).
- **Body:** `{ email, password }`.
- **Responses:**
  - `200` `{ token, user: { id, email, name, role, emailVerified } }`
  - `400` missing fields / invalid email / bad password format / `CSRF token missing`
  - `401` `{ error: 'Invalid credentials' }`
  - `403` `{ error: 'Please verify your email before logging in', needsVerification: true, email }`
  - `429` `{ error: 'Too many login attempts…' }` (`login:{ip}:{email}`, 5 attempts)
- **Notes:** all failures logged to `systemLogs`.

### 3.3 GET `/api/auth/me`
Current user; the client session source of truth.
- **Auth:** Bearer header **or** `auth_token` httpOnly cookie.
- **Response:** `200 { user: { id, email, name, role, emailVerified, avatar, location, story, heritage, phone, address, hasPassword } }` and — when authenticated *only* by cookie — additionally `token` (fresh Bearer JWT for the same user).
- **Response (no/invalid session):** `200 { user: null }` (never 401 — lets the client clear state gracefully).

### 3.4 POST `/api/auth/logout`
- **Auth:** public (harmless without session).
- **Effect:** clears `auth_token` and `user_info` cookies (`Max-Age=0`). Client clears localStorage + dispatches `auth-change`.
- **Response:** `200 { success: true }`.

### 3.5 POST `/api/auth/role`
Switch between buyer/artisan dashboard on the **same single account** (Option-B design).
- **Auth:** Bearer/cookie user.
- **Body:** `{ role: 'buyer' | 'artisan' }`.
- **Responses:** `200 { message: 'Role switched', role }` · `200 { message: 'Already on this role', role }` · `400 Invalid role` · `403 Admin accounts cannot switch roles` · `401 Unauthorized` · `429` (5 attempts).
- **Side effects:** `role`, `roleUpdatedAt` updated on the user doc; logged.

### 3.6 POST `/api/auth/password` (change password while logged in)
- **Auth:** Bearer/cookie user.
- **Body:** `{ currentPassword?, newPassword }` — `currentPassword` required unless user has no password yet (Google-only accounts), in which case it sets one.
- **Responses:** `200 { message }` · `401` · `403 current password incorrect` · `404 user not found` · `400 weak password`.

### 3.7 POST `/api/auth/forgot-password`
Request a password-reset email.
- **Auth:** public.
- **Body:** `{ email }`.
- **Response:** always generic — `200 { message: "If an account with this email exists, we've sent a password reset link." }` (anti user-enumeration), even for unknown emails.
- **Side effects (known user only):** single-use token (32-byte, **60 min**) stored in `passwordResets` (all previous tokens for the user invalidated); email with link `/{NEXT_PUBLIC_SITE_URL}/reset-password?token=…`.
- `500` if the email pipeline fails (no enumeration leak). `429` (`forgot-password:{ip}:{email}`, 3 attempts).

### 3.8 POST `/api/auth/reset-password`
Complete the reset from the emailed link.
- **Auth:** public (the token *is* the proof of mailbox control).
- **Body:** `{ token, password }`.
- **Responses:** `200 { message: 'Password has been reset successfully…' }` · `400 Invalid/expired/used reset link` · `400 weak password (`{error, requirements}`)` · `429` (`reset-password:{ip}`, 10).
- **Side effects:** password hash updated, `emailVerified: true`, **all** pending reset tokens for the user deleted; logged.

### 3.9 GET `/api/auth/verify-email?token=…`
Email verification **link target** (browser redirect).
- **Rate limit:** `verify-token:{ip}`, 10.
- **Success:** marks `emailVerified: true`, deletes token, sets `auth_token` (httpOnly, 7d) + `user_info` cookies → redirect to `/dashboard?verified=true` (artisan/buyer respectively `/explore`), i.e. **auto-login**.
- **Failure:** redirect `/verify-email?error=<reason>` (no-token / expired / brute-force).
- Token itself is single-use (deleted after verify) and stale ones (24h expiry) are cleaned by `cleanupExpiredTokens()`.

### 3.10 POST `/api/auth/verify-email`
Resend verification email.
- **Auth:** public. **Body:** `{ email }`.
- **Response:** generic `{ message }` (`verify-resend:{ip}`, 3/hour) whether or not the account exists / is already verified.

### 3.11 GET `/api/auth/google` → OAuth 2.0 redirect
Starts Google OAuth (sets `google_oauth_state` cookie for CSRF protection; redirects to Google consent).

### 3.12 GET `/api/auth/google/callback`
Google redirect target. Verifies `state` against cookie, upserts user (`authProvider: 'google'`, first-time users get a generated email? — see `src/app/api/auth/google/callback/route.ts:153`), sets **httpOnly** `auth_token` JWT cookie (7d) and redirects to `/login?google-login=success`. The client then calls `GET /api/auth/me` (`credentials: include`) to fetch `{ user, token }` and adopts the Bearer flow.

---

## 4. Data endpoints

Generic, whitelisted-collection CRUD gateway. Auth resolution is identical everywhere: Bearer header → fallback `auth_token` cookie → DB lookup of the user (referred below as the **requester**).

Allowed collections (`ALLOWED_COLLECTIONS`): `users`, `orders`, `products`, `carts`, `likes`, `comments`, `contactMessages`, `systemLogs`. Anything else → `403 { error: 'Collection not accessible' }`.

Write-safe fields are enforced per collection (`ALLOWED_PRODUCT_FIELDS`, `ALLOWED_COMMENT_FIELDS`, `ALLOWED_CONTACT_FIELDS`, cart sanitizers). All string inputs run through `sanitizeInput`. Query params starting with `$` are dropped (NoSQL injection guard).

### 4.1 `/api/db/[collection]` — GET
| Collection | Visibility |
|---|---|
| `products` | Everyone: `status: 'Active'` only · Artisan: own products (all statuses) additionally · Admin: everything · Query params: `limit` (≤200), `select` (projection allowlist), sorted `-createdAt` |
| `orders` | Auth required · Buyer: own (`buyerId`) · Artisan: orders containing own products (`items.artisanId`) · Admin: all |
| `carts` | Auth required · own cart only (`{ data: cart or { items: [] } }`) |
| `likes` | Public when `?productId=` present: `{ data: { count, isLiked } }` (`isLiked` only with requester) |
| `comments` | Public; optionally `?productId=` |
| `users` | Admin only (list, public fields); others get `{ data: [] }` |
| `systemLogs` | Admin only; optional `level`, `category`, `limit` (1–500) |

Response shape: `{ data: [ … , { id: _id } ] }` (`_id` mapped to string `id`).

### 4.2 `/api/db/[collection]` — POST (create / action)
| Collection | Rules |
|---|---|
| `orders` | Auth required. Server injects `buyerId/Name/Email`, `status: 'Processing'`, `statusHistory`; backfills `artisanId` per item from the product. `{ id }` |
| `products` | Artisan/Admin only. Sanitized fields only; artisan ownership stamped; default `status: 'Draft'` |
| `likes` | Auth. `{ productId, action: 'add'|'remove' }` → add is idempotent |
| `comments` | Auth. `{ productId, text }`; server stamps `userId`, `userName` |
| `carts` | Auth. Actions: `{action:'add', product}` (field-allowed + `$addToSet`), `{action:'remove', productName}`, `{action:'clear'}`, or `{items:[…]}` full sync (quantity 1–99) |
| `contactMessages` | Public. `{name,email,subject,message}` required (`phone` optional), stored `read:false` |
| `systemLogs` | Admin only (client-side log shipping) |

### 4.3 `/api/db/[collection]/[id]`
- **GET** · products: private/draft ones only for owner/admin · orders: 401 unauth, 403 unless buyer-owner / artisan-with-item / admin · users: public minimal profile `{ id, name, avatar }`, full for self/admin · others: single doc (or 404).
- **PUT** · full update: `users` self/admin (admins can't be demoted in path logic — see route), `products` owner/admin, `orders`/`systemLogs` admin only (sanitized subset).
- **PATCH** · partial: `orders.status` transitions (artisan may progress orders containing own items), `products` owner/admin, etc. Returns updated doc.
- **DELETE** · `products` owner/admin; `carts` self; comments/likes self or admin; `users` self (except admins)/admin; orders admin.

### 4.4 GET `/api/db/likes/counts`
Public. `?productId=` → `{ productId, count }`; without → top 100 `{ data: [{ productId, count }] }`.

---

## 5. Utility endpoints

### 5.1 GET `/api/stats`
Public platform stats for marketing pages: `{ productCount, artisanCount, buyerCount, orderCount }`; returns zeros if DB fails (build-safe degradation).

### 5.2 POST `/api/setup`
Dev-only admin bootstrap: creates an admin. **Disabled entirely in production (403)**; requires `SETUP_SECRET` env + in-memory rate limit (3/hour). Body `{ email, password, name, secret }` → `{ token, user }`.

### 5.3 GET `/indexnow.txt`
IndexNow key feed (Bing/SEO) — returns the key text; sitemap/robots via app routes.

---

## 6. RBAC cheat-sheet

| Action | Buyer | Artisan | Admin |
|---|---|---|---|
| Browse products | ✅ active only | ✅ active + own drafts | ✅ all |
| Place order | ✅ | ✅ | ✅ |
| See orders | own | containing own products | all |
| Create product | ❌ | ✅ | ✅ |
| Progress order status | ❌ | ✅ (own items) | ✅ |
| Switch role buyer↔artisan | ✅ | ✅ | ❌ (blocked) |
| List users / logs | ❌ | ❌ | ✅ |
| Set any user's role by id | ❌ | ❌ | ❌ (unsafe legacy route was **removed**) |

---

## 7. Security summary

- Password hashing bcrypt (`src/lib/password.ts`), strength policy enforced server-side **and** pre-validated client-side.
- JWT HS256 with required `JWT_SECRET` (throws in production if missing; loud dev fallback otherwise).
- httpOnly + Secure + SameSite=Lax cookies for Google/verification sessions; Bearer localStorage for email/password.
- Rate limiting everywhere sensitive: login 5, register 5, role 5, forgot 3, reset 10, verify 10/3, per IP (+email where relevant), fixed window in Mongo (`rate_limit` collection).
- Anti user-enumeration generic responses (forgot-password, resend verification, setup).
- Single-use, short-lived email tokens (24h verify / 60min reset), invalidated on reuse or supersession.
- NoSQL injection guards (no `$` query params), field allowlists on writes, `sanitizeInput` on strings, ObjectId parsing everywhere.
- CSRF: same-origin middleware check + `x-csrf-token` on login.
- Audit trail: auth events, orders, product changes → `systemLogs` (level/category/user metadata).
- Removed: unauthenticated `/api/auth/select-role` (would let anyone promote to admin), broken token-rotation `jti`/`tokenId` checks (caused false logouts), edge-incompatible Node `crypto` in middleware.

---

## 8. Environment variables

| Var | Purpose |
|---|---|
| `MONGODB_URI` | Atlas/standard connection string (**required**) |
| `MONGODB_DB_NAME` | Database name (e.g. `kalaconnect`) |
| `JWT_SECRET` | Strong random secret (**required in production**) |
| `RESEND_API_KEY` | Transactional email (verification + password reset) |
| `NEXT_PUBLIC_SITE_URL` | Public URL used in email links |
| `SETUP_SECRET` | Dev-only admin bootstrap secret |
| Google OAuth client id/secret | `/api/auth/google*` |

## 9. Key source files

| File | Responsibility |
|---|---|
| `src/lib/jwt.ts` | sign/verify tokens (7d, HS256) |
| `src/lib/mongodb.ts` | client cache + unique email index |
| `src/lib/password.ts`, `password-validation.ts` | hashing & policy |
| `src/lib/rate-limit.ts` | fixed-window limiter (Mongo-backed) |
| `src/lib/verification.ts` | email-verify tokens + Resend email |
| `src/lib/password-reset.ts` | reset tokens + reset email |
| `src/auth/auth-context.tsx` | client session store (`auth-change` → `/me`) |
| `src/app/login/page.tsx`, `register/page.tsx` | forms, CSRF header, redirect targets |
| `src/app/dashboard/layout.tsx` | role-based sidebar + role switch |
| `src/middleware.ts` | CORS/CSRF cookie/security headers |
