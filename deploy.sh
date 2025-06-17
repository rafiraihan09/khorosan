#!/bin/bash

# Khorosan Clothing Store - Deployment Script
# This script prepares your application for deployment to GoDaddy

echo "🚀 Starting Khorosan Clothing Store Deployment Preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check for environment variables
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found."
    print_status "Creating sample .env.local file..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EOF
    print_warning "Please update .env.local with your actual Supabase credentials before building."
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next out

# Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Build the application
print_status "Building application for production..."
if npm run build; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if out directory was created
if [ ! -d "out" ]; then
    print_error "Build output directory 'out' was not created"
    exit 1
fi

# Create .htaccess file for the out directory
print_status "Creating .htaccess file for proper routing..."
cat > out/.htaccess << 'EOF'
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
EOF

print_success ".htaccess file created in out directory"

# Display file count and size
file_count=$(find out -type f | wc -l)
total_size=$(du -sh out | cut -f1)

print_success "Build completed successfully!"
print_status "Files to upload: $file_count"
print_status "Total size: $total_size"

echo ""
print_status "📁 Your deployment files are ready in the 'out' directory"
print_status "📋 Next steps:"
echo "   1. Upload ALL contents of the 'out' folder to your GoDaddy public_html directory"
echo "   2. Do NOT upload the 'out' folder itself, only its contents"
echo "   3. Make sure the .htaccess file is uploaded"
echo "   4. Configure your Supabase project with your production domain"
echo "   5. Test your website at your domain"

echo ""
print_warning "Important reminders:"
echo "   • Update .env.local with real Supabase credentials if you haven't already"
echo "   • Add your domain to Supabase URL configuration"
echo "   • Enable SSL certificate in GoDaddy hosting panel"
echo "   • Test all functionality after deployment"

echo ""
print_success "🎉 Deployment preparation complete!"
print_status "📖 See DEPLOYMENT.md for detailed deployment instructions"