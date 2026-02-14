# Deployment Guide (AWS)

## Overview
This guide covers deploying the Media Portal application to AWS using EC2 (or Lightsail) for hosting both the backend and frontend (served via Nginx), and RDS for the database.

## Architecture
- **EC2 Instance**: Ubuntu 22.04 LTS
- **Database**: AWS RDS (MySQL)
- **Web Server**: Nginx (Reverse Proxy)
- **Process Manager**: PM2 (for Node.js)

## Steps

### 1. Database Setup (AWS RDS)
1. Go to AWS Console -> RDS -> Create Database.
2. Select **MySQL**.
3. Choose **Free Tier** template.
4. Set credentials (save these for `.env`).
5. Ensure "Public access" is NO (for security, connect via EC2).
6. Create database.

### 2. server Setup (EC2)
1. Launch an **EC2 Instance** (Ubuntu).
2. Allow SSH (22), HTTP (80), HTTPS (443) in Security Group.
3. SSH into the instance.

### 3. Environment Setup
```bash
sudo apt update
sudo apt install nodejs npm nginx git
```

### 4. Deploy Backend
1. Clone your repository.
2. Navigate to `backend`.
3. `npm install`
4. Create `.env` file with RDS credentials.
5. Install PM2 and start server:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "backend"
   pm2 save
   pm2 startup
   ```

### 5. Deploy Frontend
1. Navigate to `frontend`.
2. `npm install`
3. Build for production:
   ```bash
   npx ng build --configuration production
   ```
   Output will be in `dist/frontend/browser`.
4. Move build files to Nginx web root:
   ```bash
   sudo mkdir -p /var/www/media-portal
   sudo cp -r dist/frontend/browser/* /var/www/media-portal/
   ```

### 6. Configure Nginx
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/media-portal;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
    }
}
```
Restart Nginx: `sudo systemctl restart nginx`.

### 7. SSL (Optional but Recommended)
Use Certbot to enable HTTPS:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```
