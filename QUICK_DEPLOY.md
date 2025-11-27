# Quick Deployment Guide

## 🚀 Deploy Today - Step by Step

### Prerequisites

- Node.js installed
- MySQL database (local or cloud)
- Git repository (optional but recommended)

### Step 1: Build the Frontend

```bash
npm install
npm run build
```

### Step 2: Set Up Database

1. Create a MySQL database
2. Import `database.sql`:
   ```bash
   mysql -u username -p database_name < database.sql
   ```

### Step 3: Configure Environment Variables

**For Local/Shared Hosting:**
Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=money_wise
DB_PORT=3306
```

**For Frontend (if using separate API):**

```env
VITE_API_URL=/api
# Or: VITE_API_URL=https://your-api-domain.com/api
```

### Step 4: Deploy

#### Option A: Traditional Web Hosting (cPanel, etc.)

1. Upload `dist/` folder contents to `public_html/`
2. Upload `api/` folder to `public_html/api/`
3. Configure database in hosting panel
4. Set environment variables

#### Option B: Vercel (Frontend Only)

```bash
npm install -g vercel
vercel
```

**Note:** You'll need to host PHP backend separately (see Option C)

#### Option C: Full Stack on VPS

1. Set up Nginx/Apache
2. Configure PHP-FPM
3. Point web root to `dist/`
4. Configure API routing to `api/`
5. Set up MySQL

### Step 5: Test

- Visit your domain
- Test registration/login
- Verify all features work

## ⚠️ Important Notes

1. **Vercel Limitation**: Vercel doesn't support PHP. For full-stack, use:

   - Netlify (frontend) + traditional hosting (PHP backend)
   - Or use a VPS/cloud server
   - Or convert PHP to Node.js serverless functions

2. **Database**: Make sure your database is accessible from your hosting environment

3. **HTTPS**: Enable SSL certificate for production

4. **Environment Variables**: Never commit `.env` files to Git

## ✅ What's Been Fixed for Deployment

- ✅ SQL injection vulnerabilities fixed
- ✅ CORS headers configured
- ✅ Environment variable support added
- ✅ SPA routing configured
- ✅ Production build optimized
- ✅ Error handling improved

## 🆘 Quick Troubleshooting

**API not working?**

- Check database connection
- Verify CORS headers
- Check PHP error logs

**Frontend not loading?**

- Ensure SPA routing is configured
- Check build output in `dist/`
- Verify environment variables

**Database errors?**

- Verify credentials in `.env`
- Check database exists
- Ensure user has proper permissions

---

Ready to deploy! 🎉
