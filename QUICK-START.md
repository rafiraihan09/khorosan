# Quick Deployment Guide - Khorosan Clothing Store

## 🚀 Fast Track to GoDaddy Deployment

### Prerequisites
- Domain and hosting purchased from GoDaddy
- FTP access credentials from GoDaddy
- Supabase project set up

### 1. Prepare Your App (5 minutes)

```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

Or manually:
```bash
# Install and build
npm install
npm run build
```

### 2. Get Your GoDaddy FTP Info (2 minutes)

1. Login to GoDaddy
2. Go to "My Products" → "Web Hosting"
3. Click "Manage" → Find FTP credentials
4. Note: Server, Username, Password

### 3. Upload Files (10 minutes)

**Using FileZilla (Recommended):**
1. Download [FileZilla](https://filezilla-project.org/)
2. Connect using your FTP credentials
3. Navigate to `public_html` folder
4. Upload ALL contents from your `out` folder
5. Make sure `.htaccess` file is uploaded

### 4. Configure Supabase (3 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" → "URL Configuration"
4. Set Site URL: `https://yourdomain.com`
5. Add Redirect URL: `https://yourdomain.com/auth/callback`

### 5. Test Your Site (5 minutes)

Visit `https://yourdomain.com` and test:
- [ ] Homepage loads
- [ ] Product pages work
- [ ] Cart functionality
- [ ] User authentication
- [ ] Admin panel (`/admin`)

## 🔧 Troubleshooting

**404 errors on refresh?**
→ Make sure `.htaccess` file is uploaded

**Can't connect to database?**
→ Check Supabase URL and keys in your build

**Images not loading?**
→ Verify all files from `out` folder were uploaded

## 📞 Need Help?

1. **GoDaddy Issues**: Contact GoDaddy Support
2. **Technical Issues**: Check the full DEPLOYMENT.md guide
3. **Supabase Issues**: Check Supabase documentation

## ⚡ Quick Commands

```bash
# Rebuild after changes
npm run build

# Check what's in your deployment folder
ls -la out/

# Test locally before deploying
npx serve out
```

---

**Total Time: ~25 minutes** ⏱️

Your Khorosan clothing store will be live and ready for customers!