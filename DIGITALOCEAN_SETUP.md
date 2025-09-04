# DigitalOcean Spaces Setup for Studio Vista

This document explains how to set up DigitalOcean Spaces for image uploads in your Studio Vista printing application.

## 1. Create DigitalOcean Spaces Bucket

1. **Log into DigitalOcean** and go to **Spaces** (Object Storage)
2. **Create a new Space:**
   - Name: `studiovista` (or your preferred name)
   - Region: `Frankfurt (FRA1)` (recommended for Croatia)
   - File Listing: `Restrict File Listing` (for security)
   - CDN: **Enable CDN** (for faster image delivery)

## 2. Generate Spaces Access Keys

1. Go to **API** → **Spaces Keys**
2. **Generate New Key:**
   - Name: `Studio Vista Upload Key`
   - Copy both the **Access Key** and **Secret Key**

## 3. Update Environment Variables

Add these variables to your `.env.local` file:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_REGION=fra1
DO_SPACES_KEY=your_spaces_access_key_here
DO_SPACES_SECRET=your_spaces_secret_key_here
DO_SPACES_BUCKET=studiovista
DO_SPACES_CDN=https://studiovista.fra1.cdn.digitaloceanspaces.com

# JWT Secret (if not already set)
JWT_SECRET=your-super-secret-jwt-key-here
```

**Important:** Replace the placeholder values:

- `your_spaces_access_key_here` → Your actual Spaces access key
- `your_spaces_secret_key_here` → Your actual Spaces secret key
- Update the CDN URL if you chose a different bucket name or region

## 4. Spaces Permissions (CORS Configuration)

To allow uploads from your website, configure CORS in your Space:

1. Go to your **Space** → **Settings** → **CORS**
2. Add this configuration:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

Replace `https://yourdomain.com` with your actual domain when you deploy.

## 5. Folder Structure

The upload system will create this folder structure in your Space:

```
studiovista/
├── print-uploads/
│   ├── 1234567890-image1.jpg
│   ├── 1234567890-image2.png
│   └── ...
└── (other folders for future features)
```

## 6. Pricing Considerations

**DigitalOcean Spaces Pricing (as of 2024):**

- Storage: $5/month for 250 GB
- CDN Transfer: First 1 TB free, then $0.01/GB
- API Requests: Included

For a printing business, this is very cost-effective:

- 1000 high-quality print images (~5MB each) = ~5GB storage
- Monthly cost: ~$5 + minimal CDN costs

## 7. Security Features

✅ **Implemented Security:**

- File type validation (only images allowed)
- File size limits (10MB maximum)
- Unique filename generation (prevents overwrites)
- Public read access (for print processing)
- Croatian error messages for better UX

## 8. Image Processing

The system includes:

- **Automatic optimization** for web delivery
- **CDN distribution** for fast global access
- **Metadata storage** (upload timestamp, original filename)
- **Cache headers** for performance (1 year cache)

## 9. Testing the Setup

1. **Start your development server:** `yarn dev`
2. **Open the website** and click on any "Prilagodi" button
3. **Upload a test image** - you should see:
   - Progress bar during upload
   - Success confirmation
   - Image preview in the modal
4. **Check your Spaces bucket** - the image should appear in `print-uploads/`

## Troubleshooting

**"Upload failed" errors:**

1. Check your `.env.local` file has correct Spaces credentials
2. Verify CORS configuration in your Space settings
3. Ensure the bucket name matches your configuration

**"Image too large" errors:**

- Current limit is 10MB - perfect for high-quality prints
- For larger files, customers can use image compression tools

**Slow uploads:**

- DigitalOcean Spaces has excellent global performance
- CDN automatically optimizes delivery worldwide

## Next Steps

Once this is working, you can:

- Add image resizing/optimization
- Implement batch uploads
- Add progress tracking for multiple files
- Create admin tools for managing uploaded images

Your Croatian printing business now has professional, scalable image upload capabilities! 🇭🇷📸
