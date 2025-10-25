# New Application Deployment Guide

This guide walks you through deploying a new application to the Momentum Netball server infrastructure following the established development → production pattern.

## Prerequisites

- Root or sudo access to the server
- Domain name configured and pointed to server IP (138.199.209.100)
- Application code ready for deployment
- Understanding of your app's technology stack (Node.js/Docker/Static/Go/etc.)

## Step 1: Choose Your Port Number

Allocate an unused port for your application's backend/API:

```bash
# Check currently used ports
netstat -tlnp | grep LISTEN

# Common port ranges:
# 3000-3010: Frontend dev servers
# 3011-3029: Available for new services
# 3030-3039: Backend APIs
# 8084+: Go APIs (if applicable)
```

**Choose your port**: `____` (write it down for later steps)

## Step 2: Set Up Development Directory

```bash
# Navigate to development workspace
cd /var/www/apps/development/

# Create your app directory
sudo mkdir -p my-app-name

# Set proper ownership
sudo chown -R $USER:$USER my-app-name

cd my-app-name
```

## Step 3: Set Up Your Application

### Option A: Node.js/Express Application

```bash
# Initialize your app
yarn init -y

# Install dependencies
yarn add express dotenv cors

# Create basic structure
mkdir -p src
touch src/server.js
touch .env
touch .gitignore

# Create basic server.js
cat > src/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3011;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Create .env
cat > .env << 'EOF'
PORT=3011
NODE_ENV=development
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF
```

### Option B: Docker-Based Application

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  my-app-backend:
    build: ./backend
    container_name: my-app-backend
    ports:
      - "3011:3011"
    environment:
      - NODE_ENV=production
      - PORT=3011
    restart: unless-stopped
    networks:
      - my-app-network

  my-app-frontend:
    build: ./frontend
    container_name: my-app-frontend
    ports:
      - "3012:80"
    depends_on:
      - my-app-backend
    restart: unless-stopped
    networks:
      - my-app-network

networks:
  my-app-network:
    driver: bridge
EOF

# Create Dockerfiles in your backend/frontend directories
```

### Option C: Static Website with Backend

```bash
# Create directory structure
mkdir -p frontend
mkdir -p backend

# Frontend: index.html, style.css, script.js
# Backend: Node.js API (see Option A)
```

## Step 4: Create Production Deployment Directory

```bash
# Create production directory
sudo mkdir -p /var/www/apps/deployments/production/my-app-name
sudo chown -R $USER:$USER /var/www/apps/deployments/production/my-app-name
```

## Step 5: Create Deployment Script

```bash
# Create deployment script
sudo nano /var/www/apps/infrastructure/scripts/deploy-my-app.sh
```

### Deployment Script Template (Node.js/PM2):

```bash
#!/bin/bash

# Deployment script for My App
# Usage: ./deploy-my-app.sh [production|development]

set -e

ENV=${1:-production}
DEV_DIR="/var/www/apps/development/my-app-name"
PROD_DIR="/var/www/apps/deployments/production/my-app-name"

echo "======================================"
echo "Deploying My App ($ENV)"
echo "======================================"

if [ "$ENV" == "production" ]; then
    echo "Step 1: Syncing files from development to production..."
    
    # Copy files excluding node_modules and .env
    rsync -av --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.env' \
        --exclude '*.log' \
        "$DEV_DIR/" "$PROD_DIR/"
    
    cd "$PROD_DIR"
    
    echo "Step 2: Installing dependencies..."
    yarn install --production
    
    echo "Step 3: Restarting PM2 service..."
    pm2 restart my-app-api || pm2 start src/server.js --name my-app-api
    pm2 save
    
    echo "Step 4: Checking service status..."
    pm2 list | grep my-app
    
    echo "======================================"
    echo "Deployment complete!"
    echo "======================================"
    echo "Service: my-app-api"
    echo "Logs: pm2 logs my-app-api"
    echo "Status: pm2 status my-app-api"
else
    echo "Development mode - no deployment needed"
    cd "$DEV_DIR"
    yarn install
    echo "Run: node src/server.js"
fi
```

### Deployment Script Template (Docker):

```bash
#!/bin/bash

set -e

ENV=${1:-production}
DEV_DIR="/var/www/apps/development/my-app-name"
PROD_DIR="/var/www/apps/deployments/production/my-app-name"

echo "======================================"
echo "Deploying My App ($ENV)"
echo "======================================"

if [ "$ENV" == "production" ]; then
    echo "Step 1: Syncing files..."
    rsync -av --delete \
        --exclude '.git' \
        --exclude '.env' \
        "$DEV_DIR/" "$PROD_DIR/"
    
    cd "$PROD_DIR"
    
    echo "Step 2: Rebuilding containers..."
    docker compose down
    docker compose up -d --build
    
    echo "Step 3: Checking container status..."
    docker ps | grep my-app
    
    echo "======================================"
    echo "Deployment complete!"
    echo "======================================"
else
    echo "Development mode"
    cd "$DEV_DIR"
    docker compose up -d --build
fi
```

### Deployment Script Template (Static Site):

```bash
#!/bin/bash

set -e

DEV_DIR="/var/www/apps/development/my-app-name/frontend"
PROD_DIR="/var/www/apps/deployments/production/my-app-name"

echo "======================================"
echo "Deploying My App (Static)"
echo "======================================"

echo "Syncing files..."
rsync -av --delete \
    --exclude '.git' \
    "$DEV_DIR/" "$PROD_DIR/"

echo "Setting permissions..."
sudo chown -R www-data:www-data "$PROD_DIR"
sudo chmod -R 755 "$PROD_DIR"

echo "Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "======================================"
echo "Deployment complete!"
echo "======================================"
```

Make the script executable:

```bash
sudo chmod +x /var/www/apps/infrastructure/scripts/deploy-my-app.sh
```

## Step 6: Configure Nginx

```bash
# Create nginx site configuration
sudo nano /etc/nginx/sites-available/my-app.mydomain.com
```

### Nginx Template (Static Site):

```nginx
server {
    listen 80;
    server_name my-app.mydomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name my-app.mydomain.com;
    
    # SSL certificates (will be created by Certbot)
    ssl_certificate /etc/letsencrypt/live/my-app.mydomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-app.mydomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Root directory
    root /var/www/apps/deployments/production/my-app-name;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/my-app-access.log;
    error_log /var/log/nginx/my-app-error.log;
    
    # Static files with caching
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Nginx Template (API Backend + Static Frontend):

```nginx
server {
    listen 80;
    server_name my-app.mydomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name my-app.mydomain.com;
    
    ssl_certificate /etc/letsencrypt/live/my-app.mydomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-app.mydomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    access_log /var/log/nginx/my-app-access.log;
    error_log /var/log/nginx/my-app-error.log;
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3011/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static frontend
    location / {
        root /var/www/apps/deployments/production/my-app-name/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/my-app.mydomain.com /etc/nginx/sites-enabled/

# Reload nginx
sudo systemctl reload nginx
```

## Step 7: Set Up SSL Certificate

```bash
# Install SSL certificate with Certbot
sudo certbot certonly --nginx -d my-app.mydomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 8: Configure PM2 (if using Node.js)

```bash
# Deploy to production first
/var/www/apps/infrastructure/scripts/deploy-my-app.sh production

# Or manually start PM2
cd /var/www/apps/deployments/production/my-app-name
pm2 start src/server.js --name my-app-api
pm2 save
pm2 startup

# Verify
pm2 list
pm2 logs my-app-api
```

## Step 9: Test the Deployment

```bash
# Test API endpoint
curl http://localhost:3011/health

# Test public URL
curl https://my-app.mydomain.com/

# Check logs
pm2 logs my-app-api --lines 50
# OR
docker logs my-app-backend --tail 50

# Check nginx logs
sudo tail -f /var/log/nginx/my-app-access.log
sudo tail -f /var/log/nginx/my-app-error.log
```

## Step 10: Create Project-Specific Documentation

```bash
# Create CLAUDE.md in your project directory
nano /var/www/apps/development/my-app-name/CLAUDE.md
```

### CLAUDE.md Template:

```markdown
# My App - CLAUDE.md

## Overview

Brief description of what this app does.

## Architecture

- **Tech Stack**: Node.js/Express, React, PostgreSQL, etc.
- **Development Port**: 3011 (API), 3012 (Frontend)
- **Production URL**: https://my-app.mydomain.com

## Development

### Setup

\`\`\`bash
cd /var/www/apps/development/my-app-name
yarn install
\`\`\`

### Running Locally

\`\`\`bash
# Backend
cd backend
yarn start

# Frontend
cd frontend
yarn dev
\`\`\`

### Environment Variables

\`\`\`bash
PORT=3011
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
\`\`\`

## Deployment

### Deploy to Production

\`\`\`bash
/var/www/apps/infrastructure/scripts/deploy-my-app.sh production
\`\`\`

### Verify Deployment

\`\`\`bash
pm2 logs my-app-api
curl https://my-app.mydomain.com/health
\`\`\`

## Troubleshooting

### Service not responding

\`\`\`bash
pm2 restart my-app-api
pm2 logs my-app-api --lines 100
\`\`\`

### Database connection issues

\`\`\`bash
docker ps | grep postgres
docker logs my-app-postgres
\`\`\`

## Important Notes

- Always work in development directory
- Test locally before deploying
- Check logs after deployment
```

## Step 11: Update Main CLAUDE.md Files

Update `/var/www/apps/development/CLAUDE.md` to include your new app:

```bash
sudo nano /var/www/apps/development/CLAUDE.md
```

Add your app to the project portfolio section with:
- Project name and path
- Tech stack
- Ports
- Production URL
- Deployment command

## Step 12: Set Up Backups (Optional)

If your app has a database, update the backup script:

```bash
sudo nano /root/backup-script.sh
```

Add database backup commands for your app.

## Common Patterns by App Type

### Pattern 1: Static Landing Page

- **Directory**: frontend files only
- **Nginx**: Serve static files directly
- **Deployment**: rsync to production + reload nginx
- **Example**: Mixed League, Netball Hour

### Pattern 2: Node.js API + Static Frontend

- **Directory**: backend/ and frontend/ folders
- **Nginx**: Proxy /api/ to backend, serve static for /
- **Deployment**: rsync + PM2 restart
- **Example**: CRM, Landing Pages backend

### Pattern 3: Full Docker Stack

- **Directory**: docker-compose.yml with multiple services
- **Nginx**: Proxy to container ports
- **Deployment**: rsync + docker compose rebuild
- **Example**: ADNA

### Pattern 4: PWA with Backend

- **Directory**: Complex frontend (React/Vue) + API
- **Nginx**: Reverse proxy with cache headers for PWA
- **Deployment**: Build frontend + deploy both
- **Example**: Scorer App

## Checklist

- [ ] Port number allocated
- [ ] Development directory created
- [ ] Application code set up
- [ ] Deployment script created and tested
- [ ] Nginx configuration created
- [ ] Site enabled in nginx
- [ ] SSL certificate obtained
- [ ] PM2/Docker service configured
- [ ] Production deployment successful
- [ ] Public URL accessible
- [ ] CLAUDE.md documentation created
- [ ] Main CLAUDE.md updated
- [ ] Backups configured (if needed)

## Quick Reference Commands

```bash
# Navigate to project
cd /var/www/apps/development/my-app-name

# Deploy to production
/var/www/apps/infrastructure/scripts/deploy-my-app.sh production

# Check service status
pm2 list | grep my-app
docker ps | grep my-app

# View logs
pm2 logs my-app-api
docker logs my-app-backend

# Restart service
pm2 restart my-app-api
docker restart my-app-backend

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check SSL certificate
sudo certbot certificates | grep my-app
```

## Need Help?

1. Check existing app directories for examples
2. Review deployment scripts in `/var/www/apps/infrastructure/scripts/`
3. Check nginx configs in `/etc/nginx/sites-available/`
4. Look at similar app's CLAUDE.md for guidance

## Examples to Reference

- **Simple Static Site**: `/var/www/apps/development/landing-pages/mixed-league/`
- **Node.js API**: `/var/www/apps/development/crm/`
- **Docker Full Stack**: `/var/www/apps/development/adna/`
- **PWA**: `/var/www/apps/development/scorer/`

