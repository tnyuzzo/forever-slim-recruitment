import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from './providers'

const fbpScript = `
(function() {
  var domain = '.closeragency.eu';
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; domain=' + domain + '; SameSite=Lax';
  }
  // _fbp: genera o legge
  var fbp = getCookie('_fbp');
  if (!fbp) {
    fbp = 'fb.1.' + Date.now() + '.' + Math.floor(Math.random() * 1e10);
    setCookie('_fbp', fbp, 90);
  }
  window._fbp = fbp;
  // _fbc: genera da fbclid se presente
  var params = new URLSearchParams(window.location.search);
  var fbclid = params.get('fbclid');
  if (fbclid) {
    var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    setCookie('_fbc', fbc, 90);
    window._fbc = fbc;
  } else {
    var existingFbc = getCookie('_fbc');
    if (existingFbc) window._fbc = existingFbc;
  }
  // UTM → localStorage (persistenza cross-session)
  var UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','funnel','campaign_id','adset_id','ad_id','placement','site_source_name','fbclid'];
  var fresh = {};
  UTM_KEYS.forEach(function(k) { var v = params.get(k); if (v) fresh[k] = v; });
  if (Object.keys(fresh).length > 0) {
    try {
      if (fresh.utm_source) {
        localStorage.setItem('fs_utm', JSON.stringify(fresh));
      } else {
        var existing = JSON.parse(localStorage.getItem('fs_utm') || '{}');
        localStorage.setItem('fs_utm', JSON.stringify(Object.assign({}, existing, fresh)));
      }
    } catch(e) {}
  }
  // Pageview via Zaraz (proxied server-side da Cloudflare)
  document.addEventListener('DOMContentLoaded', function() {
    if (window.zaraz && typeof window.zaraz.track === 'function') {
      window.zaraz.track('fb_pageview');
    }
  });
})();
`

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Opportunità Vendita Consulenziale | Lavora da Casa',
  description: 'Niente chiamate a freddo: solo appuntamenti già prenotati. Lavora da casa con i tuoi orari nel settore benessere e controllo peso.',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: fbpScript }} />
        {/* Cloudflare Zaraz — pageview tracciato server-side */}
        <script defer src="https://zaraz.closeragency.eu/cdn-cgi/zaraz/i.js" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#FFFFFF] text-[#1A1A1A] min-h-screen flex flex-col`}>
        <PostHogProvider>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </PostHogProvider>
      </body>
    </html>
  )
}
