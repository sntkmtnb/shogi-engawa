import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE0B2 50%, #FFCC80 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui',
      }}>
        <div style={{ fontSize: 48, color: '#5D4037', fontWeight: 900, marginBottom: 8, display: 'flex' }}>
          ▲
        </div>
        <div style={{ fontSize: 72, color: '#3E2723', fontWeight: 900, letterSpacing: 8, display: 'flex' }}>
          将棋の縁台
        </div>
        <div style={{ fontSize: 32, color: '#795548', fontWeight: 600, marginTop: 16, display: 'flex' }}>
          50歳からの居場所
        </div>
        <div style={{ fontSize: 24, color: '#8D6E63', marginTop: 32, display: 'flex' }}>
          源さんと一局、指しませんか？
        </div>
      </div>
    ),
    { ...size }
  );
}
