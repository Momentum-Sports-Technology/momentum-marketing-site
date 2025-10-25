# Deploying Momentum Marketing Site to Hetzner

## Prerequisites

- Hetzner server with Ubuntu 22.04+
- SSH access to the server
- Domain name pointing to the server IP
- Node.js 18+ installed on the server

## Deployment Steps

### 1. Server Setup

**SSH into your Hetzner server:**

```bash
ssh root@your-server-ip
```

**Install Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Install PM2 (Process Manager):**

```bash
sudo npm install -g pm2
```

**Install Nginx:**

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Clone and Build the Project

**Clone the repository:**

```bash
cd /var/www
sudo git clone https://github.com/Momentum-Sports-Technology/momentum-marketing-site.git
cd momentum-marketing-site
```

**Install dependencies:**

```bash
sudo yarn install
```

**Create environment file:**

```bash
sudo nano .env.production
```

Add:

```env
NODE_ENV=production
ADMIN_PASSWORD=your-secure-password-here
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.com
```

**Build the project:**

```bash
sudo yarn build
```

### 3. Start with PM2

**Start the application:**

```bash
sudo pm2 start npm --name "momentum-marketing" -- start
```

**Save PM2 configuration:**

```bash
sudo pm2 save
sudo pm2 startup
```

**Check status:**

```bash
sudo pm2 status
sudo pm2 logs momentum-marketing
```

### 4. Configure Nginx

**Create Nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/momentum-marketing
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/momentum-marketing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL with Let's Encrypt

**Install Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate:**

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Auto-renewal is set up automatically**

### 6. Firewall Configuration

**Configure UFW:**

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 7. Update DNS

Point your domain to the Hetzner server IP:

```
A Record: @ -> your-server-ip
A Record: www -> your-server-ip
```

### 8. Verification

Visit `https://your-domain.com` - your site should be live!

**Test admin panel:** `https://your-domain.com/admin`

## Updating the Site

When you push updates to GitHub:

```bash
cd /var/www/momentum-marketing-site
sudo git pull
sudo yarn install
sudo yarn build
sudo pm2 restart momentum-marketing
```

## Troubleshooting

**Check PM2 logs:**

```bash
sudo pm2 logs momentum-marketing
```

**Check Nginx logs:**

```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart services:**

```bash
sudo pm2 restart momentum-marketing
sudo systemctl restart nginx
```

**Check if app is running:**

```bash
curl http://localhost:3000
```

## File Paths

- Application: `/var/www/momentum-marketing-site`
- PM2 config: `~/.pm2`
- Nginx config: `/etc/nginx/sites-available/momentum-marketing`
- Environment: `/var/www/momentum-marketing-site/.env.production`

## Security Checklist

- [ ] Changed `ADMIN_PASSWORD` to a secure password
- [ ] Generated unique `NEXTAUTH_SECRET`
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Domain correctly configured
- [ ] PM2 auto-start configured
- [ ] SSH key authentication set up

## Maintenance

**Check PM2 status:**

```bash
sudo pm2 status
```

**View logs:**

```bash
sudo pm2 logs momentum-marketing --lines 100
```

**Monitor resources:**

```bash
sudo pm2 monit
```

**Restart after server reboot (automatic with PM2 startup):**

```bash
sudo pm2 startup
sudo pm2 save
```

