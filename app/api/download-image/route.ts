import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    const filename = searchParams.get('filename');

    console.log('=== DOWNLOAD DEBUG ===');
    console.log('Download request for URL:', imageUrl);
    console.log('Filename:', filename);

    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error('No valid image URL provided');
      return NextResponse.json(
        { success: false, error: 'URL slike je obavezan' },
        { status: 400 }
      );
    }

    console.log('URL starts with data:', imageUrl.startsWith('data:'));
    console.log(
      'URL includes digitaloceanspaces:',
      imageUrl.includes('.digitaloceanspaces.com')
    );

    let imageBuffer: ArrayBuffer | undefined;
    let contentType = 'image/jpeg';
    let extension = 'jpg';

    // Handle base64 images
    if (imageUrl.startsWith('data:')) {
      console.log('Processing base64 image');
      try {
        // Extract content type from data URL
        const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          throw new Error('Invalid base64 format');
        }

        contentType = matches[1];
        const base64Data = matches[2];

        // Convert base64 to buffer
        imageBuffer = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;

        // Determine extension from content type
        if (contentType.includes('png')) extension = 'png';
        else if (contentType.includes('webp')) extension = 'webp';
        else if (contentType.includes('gif')) extension = 'gif';
        else extension = 'jpg';
      } catch (error) {
        console.error('Error processing base64 image:', error);
        throw new Error('Failed to process base64 image');
      }
    }
    // Handle DigitalOcean Spaces URLs
    else if (
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
            console.log('✅ Image downloaded successfully');
            imageBuffer = await imageResponse.arrayBuffer();
            contentType =
              imageResponse.headers.get('content-type') || 'image/jpeg';

            // Get extension from URL - fix double extension bug
            if (urlToTry.includes('.')) {
              const urlParts = urlToTry.split('/').pop()?.split('.') || [];
              if (urlParts.length > 1) {
                extension =
                  urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
              }
            }
            break; // Success! Exit the retry loop
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
      if (!imageBuffer) {
        console.error('All DigitalOcean Spaces URLs failed:', lastError);
        return NextResponse.json(
          {
            success: false,
            error:
              'Slika nije dostupna. Možda CDN nije omogućen ili slika ne postoji.',
            debug: {
              originalUrl: imageUrl,
              triedUrls: urlsToTry,
              lastError: lastError?.message,
            },
          },
          { status: 404 }
        );
      }
    } else {
      console.error(
        'Invalid image URL - not base64 or DigitalOcean Spaces:',
        imageUrl
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Neispravna URL slike - mora biti s DigitalOcean Spaces-a',
        },
        { status: 400 }
      );
    }

    // Create response with image data
    const response = new NextResponse(imageBuffer);

    // Set headers for download
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', imageBuffer.byteLength.toString());
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${(filename || 'image').replace(
        /[^a-zA-Z0-9-_]/g,
        '_'
      )}.${extension}"`
    );
    response.headers.set('Cache-Control', 'no-cache');

    console.log('Response headers set, returning response');
    console.log(
      'Final response headers:',
      Object.fromEntries(response.headers.entries())
    );
    return response;
  } catch (error) {
    console.error('Image download error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'Greška pri preuzimanju slike: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
        debug: {
          url: request.nextUrl.searchParams.get('url'),
          filename: request.nextUrl.searchParams.get('filename'),
        },
      },
      { status: 500 }
    );
  }
}
