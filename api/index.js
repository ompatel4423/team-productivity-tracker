const https = require('https');

module.exports = async (req, res) => {
  try {
    const targetUrl = 'https://script.google.com/macros/s/AKfycbwTKhzFTGORjQi3FAHSlyzPI2dt2-2wpj63GN22QTxHWOGo04jX2iSIFi5L5w73Zkuf/exec';

    const html = await new Promise((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      };

      https.get(targetUrl, options, (gRes) => {
        // If Google redirects (e.g. 302), follow it
        if (gRes.statusCode >= 300 && gRes.statusCode < 400 && gRes.headers.location) {
          https.get(gRes.headers.location, options, (redirectRes) => {
            let body = '';
            redirectRes.on('data', chunk => body += chunk);
            redirectRes.on('end', () => resolve(body));
          }).on('error', reject);
          return;
        }

        let body = '';
        gRes.on('data', chunk => body += chunk);
        gRes.on('end', () => resolve(body));
      }).on('error', reject);
    });

    if (!html || html.length < 500) {
      return res.status(502).send('Error loading upstream content.');
    }

    // Enhance HTML for PWA & strip Google warning banner
    const pwaTags = `
      <link rel="manifest" href="/manifest.json">
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
      <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png">
      <meta name="theme-color" content="#0F172A">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
      <style>
        #warning-bar-table tr:first-child,
        .warning-bar,
        #warning,
        .warning-banner-bar {
          display: none !important;
          height: 0 !important;
          max-height: 0 !important;
          padding: 0 !important;
          visibility: hidden !important;
        }
      </style>
      <script>
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          });
        }
      </script>
    `;

    let cleanedHtml = html
      .replace('</head>', `${pwaTags}</head>`)
      .replace(/href="\/static\//g, 'href="https://script.google.com/static/')
      .replace(/src="\/static\//g, 'src="https://script.google.com/static/');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.status(200).send(cleanedHtml);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
};
