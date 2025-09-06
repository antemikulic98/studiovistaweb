import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// DigitalOcean Spaces configuration
const spacesConfig = {
  endpoint:
    process.env.DO_SPACES_ENDPOINT || 'https://fra1.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'fra1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
  forcePathStyle: false, // DO Spaces uses subdomain-style URLs
};

// Create S3 client for DigitalOcean Spaces
export const spacesClient = new S3Client(spacesConfig);

// Bucket configuration
export const BUCKET_NAME = process.env.DO_SPACES_BUCKET || 'studiovista';
export const CDN_ENDPOINT =
  process.env.DO_SPACES_CDN ||
  `https://${BUCKET_NAME}.fra1.cdn.digitaloceanspaces.com`;

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/tiff': 'tiff',
  'image/bmp': 'bmp',
} as const;

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Upload file to DigitalOcean Spaces
export async function uploadToSpaces(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file type
    if (!(contentType in ALLOWED_FILE_TYPES)) {
      return {
        success: false,
        error:
          'Neispravna vrsta datoteke. Dozvolje su: JPG, PNG, WebP, TIFF, BMP',
      };
    }

    // Validate file size
    if (file.length > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'Datoteka je prevelika. Maksimalna veličina je 10MB',
      };
    }

    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const fileExtension =
      ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];

    // Remove existing extension from fileName to avoid double extensions
    const baseFileName = fileName.replace(/\.[^/.]+$/, '');
    const cleanFileName = baseFileName.replace(/[^a-zA-Z0-9-]/g, '_');
    const uniqueFileName = `${folder}/${timestamp}-${cleanFileName}.${fileExtension}`;

    // Upload to DigitalOcean Spaces
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read', // Make files publicly accessible
      CacheControl: 'max-age=31536000', // Cache for 1 year
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': fileName,
      },
    });

    await spacesClient.send(uploadCommand);

    // Return CDN URL for faster delivery
    const publicUrl = `${CDN_ENDPOINT}/${uniqueFileName}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Upload to Spaces failed:', error);
    return {
      success: false,
      error: 'Greška pri uploadu datoteke. Molimo pokušajte ponovno.',
    };
  }
}

// Generate presigned URL for direct upload (alternative method)
export async function generateUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<{
  success: boolean;
  uploadUrl?: string;
  publicUrl?: string;
  error?: string;
}> {
  try {
    if (!(contentType in ALLOWED_FILE_TYPES)) {
      return {
        success: false,
        error: 'Neispravna vrsta datoteke',
      };
    }

    const timestamp = Date.now();
    const fileExtension =
      ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];

    // Remove existing extension from fileName to avoid double extensions
    const baseFileName = fileName.replace(/\.[^/.]+$/, '');
    const cleanFileName = baseFileName.replace(/[^a-zA-Z0-9-]/g, '_');
    const uniqueFileName = `${folder}/${timestamp}-${cleanFileName}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });

    // Generate presigned URL (valid for 5 minutes)
    const uploadUrl = await getSignedUrl(spacesClient, command, {
      expiresIn: 300,
    });
    const publicUrl = `${CDN_ENDPOINT}/${uniqueFileName}`;

    return {
      success: true,
      uploadUrl,
      publicUrl,
    };
  } catch (error) {
    console.error('Presigned URL generation failed:', error);
    return {
      success: false,
      error: 'Greška pri generiranju upload URL-a',
    };
  }
}

// Utility function to validate image dimensions for print quality
export function validateImageDimensions(
  width: number,
  height: number,
  printSize: string
): { isValid: boolean; message?: string } {
  // Minimum DPI requirements for good print quality
  const MIN_DPI = 150;

  // Parse print size (e.g., "30x20", "40x30")
  const [printWidth, printHeight] = printSize.split('x').map(Number);

  if (!printWidth || !printHeight) {
    return { isValid: false, message: 'Neispravna veličina printa' };
  }

  // Calculate required minimum pixels (cm to inches * DPI)
  const requiredWidth = (printWidth / 2.54) * MIN_DPI;
  const requiredHeight = (printHeight / 2.54) * MIN_DPI;

  if (width < requiredWidth || height < requiredHeight) {
    return {
      isValid: false,
      message: `Slika je premala za kvalitetni print. Potrebno: ${Math.round(
        requiredWidth
      )}x${Math.round(requiredHeight)}px, imate: ${width}x${height}px`,
    };
  }

  return { isValid: true };
}

// Get file info from URL
export function parseSpacesUrl(
  url: string
): { folder: string; filename: string; timestamp: number } | null {
  try {
    const urlParts = url.replace(CDN_ENDPOINT, '').split('/');
    const folder = urlParts[1];
    const filename = urlParts[2];
    const timestamp = parseInt(filename.split('-')[0]);

    return { folder, filename, timestamp };
  } catch {
    return null;
  }
}
