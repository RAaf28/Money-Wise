# Deployment Guide for Money Wise

This guide will help you deploy the Money Wise application to production.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend Only - Recommended for Quick Start)

**Note:** Vercel doesn't natively support PHP. For a full-stack deployment with PHP backend, consider Option 2 or 3.

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:

   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-api.com/api`

### Option 2: Netlify (Frontend) + Traditional Hosting (PHP Backend)

#### Frontend (Netlify):

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to Netlify
3. Set environment variable: `VITE_API_URL` = `https://your-backend-api.com/api`

#### Backend (Traditional PHP Hosting):

- Upload `api/` folder to your PHP hosting (cPanel, shared hosting, etc.)
- Set up MySQL database
- Configure environment variables in hosting panel

### Option 3: Full-Stack Deployment (Recommended)

#### Using cPanel/Shared Hosting:

1. **Upload Files**:

   - Upload entire project to `public_html/` or your domain folder
   - Or upload `dist/` contents to root and `api/` to `/api/`

2. **Database Setup**:

   - Create MySQL database via cPanel
   - Import `database.sql`
   - Note database credentials

3. **Configure Environment Variables**:

   - Create `.env` file in root (or configure via hosting panel):
     ```
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     DB_PORT=3306
     ```
   - For frontend, set `VITE_API_URL=/api` (relative path)

4. **Build Frontend**:
   ```bash
   npm run build
   ```
   - Upload `dist/` contents to your web root

#### Using VPS/Cloud Server:

1. **Install Dependencies**:

   ```bash
   # Install Node.js, PHP, MySQL
   sudo apt update
   sudo apt install nodejs npm php php-mysqli mysql-server
   ```

2. **Clone and Build**:

   ```bash
   git clone <your-repo>
   cd money-wise
   npm install
   npm run build
   ```

3. **Configure Web Server** (Nginx example):

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/money-wise/dist;
       index index.html;

       # Frontend SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # PHP API
       location /api {
           root /var/www/money-wise;
           try_files $uri =404;
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_index index.php;
           include fastcgi_params;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       }
   }
   ```

4. **Set Environment Variables**:
   - Create `.env` file with database credentials
   - Or set system environment variables

## 📋 Pre-Deployment Checklist

- [x] ✅ Fixed SQL injection vulnerabilities (using prepared statements)
- [x] ✅ Added proper CORS headers
- [x] ✅ Created environment variable configuration
- [x] ✅ Updated Vercel configuration for SPA routing
- [ ] ⚠️ **Set up production database** (create MySQL database and import `database.sql`)
- [ ] ⚠️ **Configure environment variables** on hosting platform
- [ ] ⚠️ **Test API endpoints** before deploying
- [ ] ⚠️ **Update API base URL** in frontend environment variables
- [ ] ⚠️ **Enable HTTPS/SSL** certificate
- [ ] ⚠️ **Set up database backups**

## 🔧 Environment Variables

### Frontend (.env or hosting platform):

```env
VITE_API_URL=/api
# Or for separate backend:
# VITE_API_URL=https://api.yourdomain.com
```

### Backend (PHP - .env or hosting panel):

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=money_wise
DB_PORT=3306
```

## 🗄️ Database Setup

1. **Create Database**:

   ```sql
   CREATE DATABASE money_wise;
   ```

2. **Import Schema**:
   ```bash
   mysql -u username -p money_wise < database.sql
   ```
   Or use phpMyAdmin to import `database.sql`

## 🔒 Security Considerations

### Already Implemented:

- ✅ SQL injection protection (prepared statements)
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Input validation

### Additional Recommendations:

- [ ] Add rate limiting to API endpoints
- [ ] Implement JWT tokens for authentication
- [ ] Add CSRF protection
- [ ] Enable HTTPS only
- [ ] Set up proper error logging (without exposing sensitive info)
- [ ] Regular security updates

## 📝 Post-Deployment

1. **Test all features**:

   - User registration
   - User login
   - Transaction management
   - Budget tracking
   - Goals management

2. **Monitor**:

   - Check error logs
   - Monitor database performance
   - Set up uptime monitoring

3. **Backup**:
   - Set up automated database backups
   - Keep code in version control

## 🆘 Troubleshooting

### API not working:

- Check CORS headers
- Verify database connection
- Check PHP error logs
- Ensure `.htaccess` is working (if using Apache)

### Frontend routing issues:

- Ensure SPA routing is configured (all routes → index.html)
- Check `vercel.json` or web server config

### Database connection errors:

- Verify environment variables are set correctly
- Check database credentials
- Ensure database exists and is accessible

## 📞 Need Help?

If you encounter issues during deployment:

1. Check error logs (PHP error log, browser console)
2. Verify all environment variables are set
3. Test API endpoints directly (using Postman or curl)
4. Ensure database is accessible from your hosting environment

---

**Last Updated:** $(date)
**Version:** 1.0.0
