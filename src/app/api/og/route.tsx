import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    // Load the Inter font
    const interSemiBold = await fetch(
      new URL('/public/fonts/Inter-SemiBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    
    const interRegular = await fetch(
      new URL('/public/fonts/Inter-Regular.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(91, 38, 255, 0.4), transparent 40%), radial-gradient(circle at 70% 60%, rgba(33, 150, 243, 0.3), transparent 30%)',
            color: 'white',
            textAlign: 'center',
            padding: 40,
          }}
        >
          {/* BETA Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              padding: '4px 12px',
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'Inter-SemiBold',
                margin: 0,
              }}
            >
              BETA
            </p>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 70,
              fontFamily: 'Inter-SemiBold',
              background: 'linear-gradient(to right, white, #90caf9)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              marginBottom: 16,
              letterSpacing: -2,
            }}
          >
            Clarifi Workbench
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: 32,
              fontFamily: 'Inter-Regular',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              marginBottom: 40,
              maxWidth: 800,
            }}
          >
            Compare LLMs for Reasoning Outputs
          </p>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              marginTop: 16,
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                width: 220,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter-SemiBold',
                  color: '#90caf9',
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Test Multiple Models
              </p>
            </div>
            
            {/* Feature 2 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                width: 220,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter-SemiBold',
                  color: '#ce93d8',
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Structured Output
              </p>
            </div>
            
            {/* Feature 3 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                width: 220,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter-SemiBold',
                  color: '#81c784',
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Token Usage Monitoring
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter-SemiBold',
            data: interSemiBold,
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Inter-Regular',
            data: interRegular,
            style: 'normal',
            weight: 400,
          },
        ],
      },
    );
  } catch (error: any) {
    console.log(`Error generating OG image: ${error.message}`);
    return new Response(`Error generating image`, {
      status: 500,
    });
  }
} 