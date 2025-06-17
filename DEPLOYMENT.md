# Complete GoDaddy Deployment Guide for Khorosan Clothing Store

## Overview
This guide will help you deploy your Next.js e-commerce application to GoDaddy hosting. Your app is configured for static export, making it compatible with GoDaddy's shared hosting.

## Pre-Deployment Checklist

### 1. Verify Your Application is Ready
```bash
# Test the build process
npm run build

# Check that the 'out' folder is created with all files
ls -la out/
```

### 2. Set Up Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: After adding environment variables, rebuild:
```bash
npm run build
```

## Deployment Steps

### Step 1: Build for Production
```bash
# Clean previous builds
rm -rf .next out

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 2: Get GoDaddy Hosting Details

1. **Login to GoDaddy Account**
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account

2. **Access Hosting Control Panel**
   - Navigate to "My Products"
   - Find your hosting plan
   - Click "Manage" or "cPanel"

3. **Get FTP Credentials**
   - Look for "FTP" or "File Manager"
   - Note down:
     - FTP Server/Host
     - Username
     - Password
     - Port (usually 21 for FTP, 22 for SFTP)

### Step 3: Upload Files

#### Option A: Using FTP Client (Recommended)

**Popular FTP Clients:**
- [FileZilla](https://filezilla-project.org/) (Free, Cross-platform)
- [WinSCP](https://winscp.net/) (Windows)
- [Cyberduck](https://cyberduck.io/) (Mac/Windows)

**Upload Process:**
1. Connect to your FTP server using credentials
2. Navigate to `public_html` folder (this is your website root)
3. **Important**: Upload the CONTENTS of the `out` folder, not the folder itself
4. Upload all files and folders from `out/` to `public_html/`

#### Option B: Using GoDaddy File Manager

1. In your hosting control panel, open "File Manager"
2. Navigate to `public_html`
3. Upload all contents from your `out` folder
4. Extract if uploaded as a zip file

### Step 4: Configure Domain Settings

#### DNS Configuration
1. In GoDaddy, go to "DNS Management"
2. Ensure these records exist:
   ```
   Type: A
   Name: @
   Value: [Your hosting server IP]
   
   Type: CNAME
   Name: www
   Value: @
   ```

#### SSL Certificate
1. In your hosting control panel
2. Look for "SSL Certificates"
3. Enable free SSL certificate
4. Wait for activation (can take up to 24 hours)

### Step 5: Configure Supabase for Production

1. **Update Supabase Project Settings:**
   - Go to [supabase.com](https://supabase.com/dashboard)
   - Select your project
   - Go to "Settings" → "API"
   - Note your Project URL and anon key

2. **Configure Authentication:**
   - Go to "Authentication" → "URL Configuration"
   - Set Site URL: `https://yourdomain.com`
   - Add Redirect URLs: `https://yourdomain.com/auth/callback`

3. **Update OAuth Providers (if using):**
   - **Google**: Update redirect URIs in Google Cloud Console
   - **Apple**: Update return URLs in Apple Developer Console
   - Use: `https://yourdomain.com/auth/callback`

### Step 6: Create .htaccess File

Create a `.htaccess` file in your `public_html` folder to handle routing:

```apache
# Enable rewrite engine
RewriteEngine On

# Handle client-side routing
RewriteBase /

# Don't rewrite files or directories that exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite everything else to index.html
RewriteRule ^(.*)$ /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## Testing Your Deployment

### 1. Basic Functionality Test
- [ ] Visit `https://yourdomain.com`
- [ ] Check that the homepage loads
- [ ] Navigate through different pages
- [ ] Test mobile responsiveness

### 2. E-commerce Features Test
- [ ] Browse products
- [ ] View product details
- [ ] Test search functionality
- [ ] Add items to cart
- [ ] Test wishlist functionality

### 3. Authentication Test
- [ ] Sign up for new account
- [ ] Sign in with existing account
- [ ] Test password reset (if implemented)
- [ ] Test OAuth login (Google/Apple)

### 4. Admin Panel Test
- [ ] Access admin panel at `/admin`
- [ ] Login with admin credentials
- [ ] Test product management
- [ ] Test order management

### 5. Checkout Process Test
- [ ] Add items to cart
- [ ] Proceed to checkout
- [ ] Fill out customer information
- [ ] Complete mock purchase
- [ ] Check order confirmation

## Troubleshooting Common Issues

### Issue: 404 Errors on Page Refresh
**Cause**: Client-side routing not configured
**Solution**: Ensure `.htaccess` file is uploaded and configured correctly

### Issue: Environment Variables Not Working
**Cause**: Variables not included in build
**Solution**: 
1. Verify `.env.local` exists with correct variables
2. Rebuild: `npm run build`
3. Re-upload files

### Issue: Supabase Connection Errors
**Cause**: Incorrect configuration or CORS issues
**Solution**:
1. Verify Supabase URL and keys
2. Check Supabase project settings
3. Ensure domain is added to allowed origins

### Issue: Images Not Loading
**Cause**: Incorrect paths or missing files
**Solution**:
1. Check that images are in the `out` folder
2. Verify image paths are relative
3. Ensure images are uploaded to server

### Issue: SSL Certificate Problems
**Cause**: Certificate not activated or DNS issues
**Solution**:
1. Wait 24-48 hours for SSL activation
2. Check DNS propagation
3. Contact GoDaddy support if needed

## Performance Optimization

### 1. Enable Compression
The `.htaccess` file includes compression settings for better performance.

### 2. Optimize Images
- Use WebP format when possible
- Compress images before upload
- Consider using a CDN for images

### 3. Monitor Performance
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Test loading times regularly

## Security Considerations

### 1. Admin Access
- Use strong passwords for admin accounts
- Consider IP restrictions for admin panel
- Regularly update admin credentials

### 2. Database Security
- Monitor Supabase usage
- Set up Row Level Security policies
- Regular security audits

### 3. Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Regular backups of data

## Backup Strategy

### 1. Code Backup
- Keep source code in version control (Git)
- Regular commits and pushes
- Tag releases for easy rollback

### 2. Database Backup
- Use Supabase's backup features
- Export data regularly
- Test restore procedures

### 3. File Backup
- Download website files periodically
- Keep local copies of uploads
- Document deployment process

## Support and Maintenance

### Getting Help
1. **GoDaddy Support**: For hosting-related issues
2. **Supabase Support**: For database issues
3. **Next.js Documentation**: For framework questions

### Regular Maintenance
- Monitor website performance
- Check for broken links
- Update content regularly
- Review analytics data

## Quick Deployment Checklist

- [ ] Build application (`npm run build`)
- [ ] Get GoDaddy FTP credentials
- [ ] Upload `out` folder contents to `public_html`
- [ ] Create `.htaccess` file
- [ ] Configure Supabase settings
- [ ] Test all functionality
- [ ] Enable SSL certificate
- [ ] Set up monitoring

## Emergency Contacts

- **GoDaddy Support**: Available 24/7 via phone/chat
- **Domain Issues**: GoDaddy Domain Support
- **Technical Issues**: Your development team

---

**Note**: This deployment process assumes you're using GoDaddy's shared hosting. For VPS or dedicated servers, additional configuration may be required.