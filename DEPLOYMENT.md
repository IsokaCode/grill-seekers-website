# Grill Seekers Deployment Guide

## 🚀 Vercel Deployment (Client Review)

### Prerequisites
- [ ] GitHub repository created
- [ ] All files committed and pushed
- [ ] Vercel account created

### Steps
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click "Deploy"

3. **Share with Client**
   - Send Vercel URL to client
   - Get feedback and make changes
   - Push updates (auto-deploys)

## 🏠 Hostinger Deployment (Final)

### Prerequisites
- [ ] Client approval received
- [ ] Hostinger account and domain ready
- [ ] Final build completed

### Steps
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**
   - Access Hostinger File Manager
   - Navigate to `public_html` directory
   - Upload all contents from `dist/` folder
   - Ensure `index.html` is in root

3. **Verify Deployment**
   - Check website loads correctly
   - Test all pages and functionality
   - Verify EmailJS integration works
   - Test PDF download

## 📋 Pre-Deployment Checklist

### Content
- [ ] All text proofread and error-free
- [ ] Contact information correct
- [ ] WhatsApp number updated
- [ ] Email addresses verified
- [ ] Package prices current

### Functionality
- [ ] Booking form working (EmailJS)
- [ ] PDF menu download working
- [ ] All navigation links working
- [ ] Mobile responsiveness tested
- [ ] All pages loading correctly

### SEO
- [ ] Meta tags optimized
- [ ] Images have alt text
- [ ] Sitemap.xml uploaded
- [ ] Robots.txt uploaded
- [ ] Page titles descriptive

### Files to Upload
- [ ] index.html
- [ ] about.html
- [ ] menu.html
- [ ] packages.html
- [ ] gallery.html
- [ ] reviews.html
- [ ] privacy-policy.html
- [ ] styles.css
- [ ] script.js
- [ ] All images in public/ folder
- [ ] PDF menu file
- [ ] robots.txt
- [ ] sitemap.xml

## 🔧 Environment Variables (if needed)

### EmailJS (already configured)
- Service ID: `service_kz1pw44`
- Template ID: `template_yqdlqnd`
- Public Key: `n3l-GjXH-zgxfb_Tx`

## 📞 Support Contacts

- **Development**: Your contact
- **Client**: Grill Seekers
- **Hosting**: Hostinger Support
- **Domain**: Domain provider support
