# Deployment Guide (jamiafurqan.org)

This guide sets up both:
- Local development (localhost)
- Live production on Hostinger shared hosting

Recommended architecture:
- Frontend: `https://jamiafurqan.org`
- Backend API: `https://api.jamiafurqan.org`

## 1. Prerequisites

1. GitHub repository has latest code on `main`.
2. Domain and SSL are active in Hostinger:
   - `jamiafurqan.org`
   - `api.jamiafurqan.org`
3. MySQL database created in Hostinger hPanel.

## 2. Files Added For You

1. `frontend/.env.production`
2. `backend/.env.hostinger.example`
3. `backend/config/cors.php` updated for localhost + live domain origins

## 3. Local Setup (keep as-is)

Frontend local env (create `frontend/.env` if needed):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Backend local env (`backend/.env`):

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
```

Run local:

```bash
# terminal 1
cd backend
php artisan serve

# terminal 2
cd frontend
npm install
npm run dev
```

## 4. Hostinger Backend Deployment (Laravel)

1. In hPanel, create subdomain `api.jamiafurqan.org`.
2. Point subdomain document root to your backend `public` folder.
3. Deploy backend code from GitHub into server directory.
4. Copy `backend/.env.hostinger.example` to `backend/.env`.
5. Edit `backend/.env` with real DB credentials and set `APP_KEY` after generate.

Run on server SSH:

```bash
cd ~/PATH_TO_PROJECT/backend
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Set permissions:

```bash
chmod -R 775 storage bootstrap/cache
```

## 5. Hostinger Frontend Deployment (Vite)

Build locally:

```bash
cd frontend
npm install
npm run build
```

Upload contents of `frontend/dist/` into Hostinger `public_html/` (domain root for `jamiafurqan.org`).

Create/update `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 6. API URL For Production

Already set in `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://api.jamiafurqan.org/api
```

## 7. Verify Deployment

1. Open frontend: `https://jamiafurqan.org`
2. Open API test endpoint: `https://api.jamiafurqan.org/api/settings`
3. Test login and admin actions (notices, gallery, testimonials, fees, profile update).

## 8. Updates After Code Changes

Backend update:

```bash
cd ~/PATH_TO_PROJECT/backend
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

Frontend update:

```bash
cd frontend
npm run build
```

Upload new `dist/` files to `public_html/`.

## 9. Common Issues

1. `403/401` from API:
   - Check token in browser localStorage.
   - Check role permissions on backend.
2. `500` on API:
   - Check `backend/storage/logs/laravel.log`.
   - Verify `.env` DB credentials.
3. React routes show 404 on refresh:
   - `.htaccess` rewrite missing in `public_html`.
4. CORS errors:
   - Confirm `backend/config/cors.php` includes localhost and jamiafurqan domains.

