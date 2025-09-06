import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'URL slike je obavezan' },
        { status: 400 }
      );
    }

    // Handle base64 images
    if (imageUrl.startsWith('data:')) {
      // For base64 images, we can't proxy them as they're already encoded
      // Return an error or redirect
      return NextResponse.json(
        {
          success: false,
          error: 'Base64 slike se ne mogu prikazati preko proxy-ja',
        },
        { status: 400 }
      );
    }

    // Handle DigitalOcean Spaces URLs
    if (
      imageUrl.includes('.digitaloceanspaces.com') ||
      imageUrl.includes('.cdn.digitaloceanspaces.com')
    ) {
      // Try CDN first, then fallback to direct Spaces URL
      const urlsToTry = [imageUrl];

      // If this is a CDN URL, also try the direct Spaces URL
      if (imageUrl.includes('.cdn.digitaloceanspaces.com')) {
        const directUrl = imageUrl.replace(
          '.cdn.digitaloceanspaces.com',
          '.digitaloceanspaces.com'
        );
        urlsToTry.push(directUrl);
      }

      let lastError: Error | null = null;

      for (const urlToTry of urlsToTry) {
        try {
          const imageResponse = await fetch(urlToTry);

          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            const contentType =
              imageResponse.headers.get('content-type') || 'image/jpeg';

            // Create response with image data for display
            const response = new NextResponse(imageBuffer);
            response.headers.set('Content-Type', contentType);
            response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
            response.headers.set('Access-Control-Allow-Origin', '*');

            return response;
          } else {
            lastError = new Error(
              `HTTP ${imageResponse.status}: ${imageResponse.statusText}`
            );
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
        }
      }

      // If all URLs failed, return error
      return NextResponse.json(
        {
          success: false,
          error: 'Slika nije dostupna za prikaz.',
          debug: {
            originalUrl: imageUrl,
            triedUrls: urlsToTry,
            lastError: lastError?.message,
          },
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Neispravna URL slike - mora biti s DigitalOcean Spaces-a',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'Greška pri dohvaćanju slike: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
