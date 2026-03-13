#!/bin/bash
set -e

echo "=== Setting up Hostinger Server ==="

# Navigate to repo
cd ~/domains/jamiafurqan.org/repo/backend

# Create production .env file
cat > .env << 'ENVEOF'
APP_NAME="Jamia Furqan"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://jamiafurqan.org

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u841016234_afs
DB_USERNAME=u841016234_asf
DB_PASSWORD="V6&rdm9/T7S"

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=jamiafurqan.org
SESSION_SECURE_COOKIE=true

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=database

CACHE_STORE=file

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="info@jamiafurqan.org"
MAIL_FROM_NAME="Jamia Furqan"

VITE_APP_NAME="Jamia Furqan"
ENVEOF

echo "=== .env created ==="

# Install composer dependencies
echo "=== Installing composer dependencies ==="
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Generate application key
echo "=== Generating application key ==="
php artisan key:generate --force

# Set directory permissions
echo "=== Setting permissions ==="
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Run database migrations
echo "=== Running migrations ==="
php artisan migrate --force

# Create storage link
echo "=== Creating storage link ==="
php artisan storage:link || echo "Storage link may already exist"

# Clear and cache config
echo "=== Optimizing ==="
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

echo "=== Backend setup complete ==="

# Now set up public_html
echo "=== Setting up public_html ==="

# Copy the frontend dist to public_html (we'll build locally and upload after)
# For now, set up the .htaccess and API routing
cd ~/domains/jamiafurqan.org

# Copy the hostinger-specific files
cp repo/hostinger.htaccess public_html/.htaccess
cp repo/hostinger-index.php public_html/hostinger-index.php

# Create storage symlink in public_html
ln -sfn ~/domains/jamiafurqan.org/repo/backend/storage/app/public ~/domains/jamiafurqan.org/public_html/storage

echo "=== Server setup complete! ==="
echo "=== Now build frontend locally and upload ==="
