'use client';

// Rendered only if the root layout itself fails, so it cannot rely on the
// LocaleProvider, fonts or Tailwind styles being available.
export default function GlobalError({ retry, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF7',
          color: '#1E293B',
          fontFamily: 'sans-serif',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ color: '#31859F' }}>Something Went Wrong / حدث خطأ ما</h1>
          <p>An unexpected error occurred. Please try again.</p>
          <p dir="rtl">حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.</p>
          <button
            type="button"
            // retry() re-fetches the segment (Next 16.2+); fall back to reset().
            onClick={() => (retry ?? reset)()}
            style={{
              marginTop: 16,
              padding: '12px 32px',
              background: '#31859F',
              color: '#E8A87C',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again / حاول مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}
