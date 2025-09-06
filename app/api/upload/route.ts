import { NextRequest, NextResponse } from 'next/server';
import { uploadToSpaces } from '../../../lib/spaces';

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const printSize = formData.get('printSize') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Datoteka nije odabrana' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json(
        {
          success: false,
          error: 'Datoteka je prevelika. Maksimalna veličina je 10MB',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Dozvoljena su samo slike' },
        { status: 400 }
      );
    }

    try {
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Optional: Validate image dimensions if printSize is provided
      if (printSize) {
        // We would need a library like Sharp to get image dimensions
        // For now, we'll skip this validation and implement it later
      }

      // Upload to DigitalOcean Spaces
      const uploadResult = await uploadToSpaces(
        buffer,
        file.name,
        file.type,
        'print-uploads'
      );

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 500 }
        );
      }

      // Return success with image URL
      return NextResponse.json({
        success: true,
        message: 'Slika je uspješno uploadana',
        imageUrl: uploadResult.url,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      });
    } catch (uploadError) {
      console.error('File processing error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Greška pri obradi datoteke' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Greška pri uploadu' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
