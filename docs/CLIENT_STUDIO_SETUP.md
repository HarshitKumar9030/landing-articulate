# Client Studio: infrastructure setup

This guide connects three applications:

- `articulatex.tech` / `articulatex.in` - marketing and contact capture
- `management.articulatex.tech` - internal operations and course console
- `app.articulatex.in` - private client course studio

## 1. Appwrite project

Create one Appwrite project: `ArticulateX Client Studio`.

Add web platforms:

| Platform | Hostname |
|---|---|
| Client app | `app.articulatex.in` |
| Management | `management.articulatex.tech` |
| Local client development | `localhost` |
| Local management development | `localhost` |

Use the endpoint shown in the Appwrite console, normally `https://cloud.appwrite.io/v1` or your region-specific cloud endpoint. Copy the Project ID.

## 2. Database

Create a database with ID `articulatex_learning` (or choose another ID and use it consistently in the environment files). The code currently uses the legacy `Databases` SDK naming; in the current Appwrite Console these resources may be displayed as **tables** and **rows**. Use the IDs below, not display names.

### Access model: one Appwrite Team per course

Before creating live course rows, create one Appwrite Team per course, for example `course_<courseId>`. The management server API key creates the Team and adds/removes learner memberships when an enrollment changes. That Team is the read audience for the published course, its published modules, and its protected files.

This is deliberately stricter than granting `users` read access at table level: a signed-in learner can only read content for courses they are enrolled in. Appwrite API keys bypass resource permissions, so management can still create, update, and publish records without broad client permissions.

### `courses` table

This holds course metadata. Only the enrolled course Team should read a published row.

| Attribute ID | Type | Required | Notes |
|---|---:|:---:|---|
| `title` | Varchar, 160 | yes | Course name |
| `description` | Longtext | yes | Course description |
| `status` | Varchar, 20 | yes | `draft` or `published` |
| `duration` | Varchar, 60 | no | e.g. `6 weeks` |
| `coverFileId` | Varchar, 120 | no | Appwrite Storage file ID |
| `publishedAt` | datetime | no | Set when publishing |

Indexes (create each as a **Key** index):

| ID | Attributes, in this order | Used by |
|---|---|---|
| `idx_courses_status_published` | `status`, `publishedAt` | filter published courses, then sort by publish date |
| `idx_courses_updated` | `$updatedAt` | management's recently updated list |

There is no ASC/DESC setting while creating an Appwrite Key index. The attribute sequence above is what matters. Choose the direction in the query at runtime: `Query.orderAsc("publishedAt")` or `Query.orderDesc("publishedAt")`; one Key index supports both directions. Keep filter attributes first and the sort attribute last, matching the query.

Permissions:

- Turn **Row security** on and leave table-level end-user permissions empty. Do not grant `Role.users()` read access to this table.
- A draft row gets no learner permissions.
- When publishing, give that row `read` to `Role.team("course_<courseId>")` only.
- Management's server API key creates, updates, publishes, and deletes rows.

### `enrollments` table

Each client-course relationship is one row.

| Attribute ID | Type | Required | Notes |
|---|---:|:---:|---|
| `userId` | Varchar, 80 | yes | Appwrite auth user `$id` |
| `courseId` | Varchar, 80 | yes | `courses` row ID |
| `status` | Varchar, 20 | yes | `active`, `paused`, `completed` |
| `startedAt` | datetime | no | |
| `completedAt` | datetime | no | |
| `accessExpiresAt` | datetime | no | Optional fixed access window |

Indexes:

| ID | Type | Attributes, in this order | Purpose |
|---|---|---|---|
| `idx_enrollments_user_course_unique` | Unique | `userId`, `courseId` | prevents duplicate enrollment |
| `idx_enrollments_user_status` | Key | `userId`, `status` | learner's active/completed course list |

Permissions:

- Turn **Row security** on; leave all end-user table permissions empty.
- Management creates and changes enrollment rows with its server API key.
- Give each enrollment row `read` to `Role.user("<userId>")`. Do not give the learner update or delete permission: course access, status, and expiry stay manager-controlled.
- When creating an `active` enrollment, add the same user to `course_<courseId>`; remove them from the Team when access is revoked or expires.

### `progress` table

One row per enrolled user and lesson/module.

| Attribute ID | Type | Required | Notes |
|---|---:|:---:|---|
| `userId` | Varchar, 80 | yes | Appwrite auth user ID |
| `courseId` | Varchar, 80 | yes | Course ID |
| `moduleId` | Varchar, 80 | yes | Module/lesson ID |
| `completed` | boolean | yes | Default `false` |
| `positionSeconds` | integer | no | Resume point for media |
| `updatedAtClient` | datetime | no | Last learner interaction |

Indexes:

| ID | Type | Attributes, in this order | Purpose |
|---|---|---|---|
| `idx_progress_user_course_module_unique` | Unique | `userId`, `courseId`, `moduleId` | one progress row per lesson per learner |
| `idx_progress_user_course` | Key | `userId`, `courseId` | load a learner's course progress |

Permissions:

- Turn **Row security** on and leave all end-user table permissions empty.
- The client app should call a protected server route to upsert progress. That route verifies the Appwrite session and active enrollment, then uses the server API key.
- Each progress row receives only `read` and `update` for `Role.user("<userId>")`. No learner delete permission is needed.

### `course_modules` table

Create this table from the beginning. It is the correct place for course lessons/modules; do not store a JSON array inside a `courses` attribute.

| Attribute ID | Type | Required |
|---|---:|:---:|
| `courseId` | Varchar, 80 | yes |
| `title` | Varchar, 160 | yes |
| `bodyMarkdown` | Longtext | no |
| `videoFileId` | Varchar, 120 | no |
| `sortOrder` | Integer | yes |
| `isPublished` | boolean | yes |

Indexes (both **Key** indexes):

| ID | Attributes, in this order | Used by |
|---|---|---|
| `idx_modules_course_sort` | `courseId`, `sortOrder` | course editor or learner module order |
| `idx_modules_course_published_sort` | `courseId`, `isPublished`, `sortOrder` | learner's published modules in order |

Use `Query.orderAsc("sortOrder")` for the normal lesson sequence or `Query.orderDesc("sortOrder")` where reverse order is useful; no separate descending index is required.

Permissions: turn **Row security** on and leave table-level end-user permissions empty. Draft modules have no learner permissions. Give a published module `read` to the matching `Role.team("course_<courseId>")`.

## 3. Storage bucket

Create bucket ID `course-assets`.

Recommended settings:

- Maximum file size: choose based on your source media workflow (start with 500 MB if Appwrite plan allows it).
- Allowed extensions: `pdf`, `mp4`, `webm`, `jpg`, `jpeg`, `png`, `webp`, `vtt`.
- Compression: enabled only for images; do not transform source course video.
- Antivirus: enabled if available.
- Enable file security.

Do not grant public bucket access. Management uploads through `APPWRITE_API_KEY`. For each course file, grant `read` only to its `Role.team("course_<courseId>")`; keep draft files permissionless. The client app can load a permitted file directly after Appwrite checks the signed-in user's Team membership, or request a protected server route to issue a short-lived download URL.

## 4. Appwrite authentication + Google Workspace email

The client app uses Appwrite **Email OTP**: it sends a short-lived email token and exchanges it for an Appwrite session. Enable Email OTP in Appwrite Authentication.

In Appwrite Console, open **Messaging -> Providers -> Add provider -> Email -> SMTP**. Prefer Workspace SMTP relay:

| Field | Value |
|---|---|
| Host | `smtp-relay.gmail.com` |
| Port | `587` |
| Encryption | TLS / STARTTLS |
| Sender | a verified Workspace address, e.g. `hello@articulatex.in` |

Google Workspace recommends SMTP relay for applications. Configure its allowed senders and authentication in the Workspace Admin console. If you choose Gmail SMTP instead, use `smtp.gmail.com`, port `587` with TLS (or 465 with SSL), the full Workspace email as username, and an app password - not the normal account password. [Google Workspace SMTP guidance](https://support.google.com/a/answer/176600?authuser=2&hl=en), [Appwrite SMTP setup](https://appwrite.io/docs/products/messaging/smtp).

Test with a real client email before publishing the app. Also add Appwrite email templates/branding if desired.

## 5. Environment variables

### `client-app` deployment (`app.articulatex.in`)

Copy `client-app/.env.example` into the hosting provider's environment configuration. Required values:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://<your-region>.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=...
NEXT_PUBLIC_APPWRITE_DATABASE_ID=articulatex_learning
NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID=courses
NEXT_PUBLIC_APPWRITE_COURSE_MODULES_COLLECTION_ID=course_modules
NEXT_PUBLIC_APPWRITE_ENROLLMENTS_COLLECTION_ID=enrollments
NEXT_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID=progress
NEXT_PUBLIC_APPWRITE_COURSE_FILES_BUCKET_ID=course-assets
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash
MONGODB_URI=...
```

Only `NEXT_PUBLIC_*` values are browser-visible. Never prefix Gemini, MongoDB, or Appwrite API-key variables with `NEXT_PUBLIC_`.

### Management deployment (`management.articulatex.tech`)

Add the same Appwrite endpoint/project/database/bucket values in `management/.env.local` or host settings, plus:

```env
APPWRITE_ENDPOINT=https://<your-region>.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=...
APPWRITE_DATABASE_ID=articulatex_learning
APPWRITE_COURSES_COLLECTION_ID=courses
APPWRITE_COURSE_MODULES_COLLECTION_ID=course_modules
APPWRITE_COURSE_FILES_BUCKET_ID=course-assets
```

Create the API key in Appwrite with only the scopes management needs: database/table/row read-write, storage bucket/file read-write, and Team read-write for enrollment provisioning. Never add it to the client app or Git.

## 6. Management workflow

1. Go to `management.articulatex.tech/dashboard/courses`.
2. Create a course as `draft`.
3. Create its `course_<courseId>` Team.
4. Upload assets to `course-assets` using server-side management routes and set their Team read permissions.
5. Add modules and lessons; only published modules get the Team read permission.
6. Create an `enrollments` row for a client's Appwrite `userId`, then add that user to the course Team while their enrollment is active.
7. Publish only when row and file permissions have been checked.

The current course console creates the course row. Add the Team and per-row/file permission provisioning before enrolling the first real client; Appwrite does not create those permissions automatically from this schema.

## 7. MongoDB's limited role

Continue to use MongoDB for management users/sessions, website leads, contact submissions, audit events, and cross-service provisioning notes. Do **not** duplicate course source-of-truth records in MongoDB: Appwrite owns courses, enrollments, progress, and bucket files.

## 8. Launch checklist

- [ ] Appwrite web platforms added for production hosts.
- [ ] Email OTP enabled and Google Workspace SMTP test succeeds.
- [ ] Database tables, attributes, indexes, and row security created.
- [ ] Course Teams and row/file permission provisioning are active before real enrollments.
- [ ] Bucket created with file security; no public course assets.
- [ ] Management API key exists with restricted scopes and is only set in management.
- [ ] Client and management have matching Appwrite IDs.
- [ ] One test user can sign in, view exactly one enrolled course, update progress, and cannot view another user's progress.
- [ ] `app.articulatex.in` is added as a domain to the client-app deployment.

Appwrite grants no access by default; permissions must be intentional at the table and row levels. [Appwrite permissions](https://appwrite.io/docs/products/databases/permissions), [table/index guidance](https://appwrite.io/docs/products/databases/tables).
