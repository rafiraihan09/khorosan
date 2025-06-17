# GoDaddy Deployment Guide for Khorosan Clothing Store

## Prerequisites
- Domain purchased from GoDaddy
- Hosting plan from GoDaddy (shared hosting, VPS, or dedicated server)
- FTP/SFTP access credentials from GoDaddy
- This Next.js application configured for static export

## Step 1: Build the Application for Production

Run these commands in your project directory:

```bash
# Install dependencies
npm install

# Build the application for production
npm run build
```

This will create an `out` folder containing all the static files needed for deployment.

## Step 2: Prepare Environment Variables

Create a `.env.local` file in your project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important**: Make sure to rebuild after adding environment variables:
```bash
npm run build
```

## Step 3: Upload Files to GoDaddy

### Method A: Using FTP/SFTP (Most Common)

1. **Get your FTP credentials from GoDaddy:**
   - Login to your GoDaddy account
   - Go to "My Products" → "Web Hosting"
   - Click "Manage" next to your hosting plan
   - Find FTP/SFTP credentials

2. **Upload the files:**
   - Use an FTP client like FileZilla, WinSCP, or Cyberduck
   - Connect using your FTP credentials
   - Navigate to the `public_html` folder (or your domain's root folder)
   - Upload ALL contents from the `out` folder to `public_html`
   - **Important**: Upload the contents OF the `out` folder, not the folder itself

### Method B: Using GoDaddy File Manager

1. Login to your GoDaddy hosting control panel
2. Open the File Manager
3. Navigate to `public_html`
4. Upload and extract all files from the `out` folder

## Step 4: Configure Domain and SSL

1. **Point your domain to the hosting:**
   - In GoDaddy, go to DNS management
   - Ensure A records point to your hosting server IP
   - Add CNAME for www if needed

2. **Enable SSL (HTTPS):**
   - In your hosting control panel, enable SSL certificate
   - GoDaddy usually provides free SSL certificates

## Step 5: Configure Supabase for Production

1. **Update Supabase settings:**
   - Go to your Supabase dashboard
   - Navigate to Authentication → URL Configuration
   - Add your domain to "Site URL": `https://yourdomain.com`
   - Add redirect URLs: `https://yourdomain.com/auth/callback`

2. **Update OAuth providers (if using Google/Apple login):**
   - Update redirect URIs in Google Cloud Console
   - Update return URLs in Apple Developer Console
   - Use your production domain: `https://yourdomain.com/auth/callback`

## Step 6: Test the Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test key functionality:
   - Browse products
   - User authentication
   - Add to cart
   - Checkout process
   - Admin panel access

## Troubleshooting Common Issues

### Issue: 404 errors on page refresh
**Solution**: Configure URL rewriting in GoDaddy hosting:
- Create a `.htaccess` file in your `public_html` folder:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Issue: Environment variables not working
**Solution**: 
- Rebuild the application after adding environment variables
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check that Supabase URLs are correct

### Issue: Images not loading
**Solution**:
- Ensure all image paths are relative
- Check that images are included in the build output
- Verify image URLs are accessible

## Alternative: Using GoDaddy VPS or Dedicated Server

If you have a VPS or dedicated server from GoDaddy, you can:

1. **Install Node.js and PM2:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

2. **Deploy and run the application:**
```bash
# Upload your project files
# Install dependencies
npm install

# Build the application
npm run build

# Serve the static files using a simple server
npx serve out -p 3000

# Or use PM2 to manage the process
pm2 start "npx serve out -p 3000" --name "khorosan-store"
pm2 startup
pm2 save
```

3. **Configure Nginx (if available):**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Checklist

- [ ] Domain resolves to your hosting
- [ ] SSL certificate is active
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Admin panel is accessible
- [ ] Contact forms work
- [ ] Images and assets load properly
- [ ] Mobile responsiveness is maintained

## Support

If you encounter issues:
1. Check GoDaddy's hosting documentation
2. Contact GoDaddy support for hosting-specific issues
3. Check browser console for JavaScript errors
4. Verify Supabase configuration and connectivity

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for admin accounts
- Regularly update dependencies
- Monitor Supabase usage and security logs
- Consider implementing rate limiting for API calls