import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const DEFAULT_GAS_URL =
  process.env.GAS_ENDPOINT_URL ||
  'https://script.google.com/macros/s/AKfycbz6bOHZteqsUnm8NhstL45sAhMzEE3KHUchm2AlEbXOVM6IjZKlFexVZdcPqkYMe0XC/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Endpoint to get current configured GAS URL & check health
  app.get('/api/gas/config', (req, res) => {
    res.json({
      url: DEFAULT_GAS_URL,
      status: 'active',
      target: 'Google Apps Script Web App (Spreadsheet Penilaian)',
    });
  });

  // Proxy GET request to Google Apps Script (handles redirects and CORS)
  app.get('/api/gas', async (req, res) => {
    try {
      const targetUrl = (req.query.url as string) || DEFAULT_GAS_URL;
      const queryParams = new URLSearchParams();

      for (const [key, value] of Object.entries(req.query)) {
        if (key !== 'url' && typeof value === 'string') {
          queryParams.append(key, value);
        }
      }

      const queryString = queryParams.toString();
      const finalUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

      const startTime = Date.now();
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (AI Studio Penilaian Siswa Proxy)',
          Accept: 'application/json, text/plain, */*',
        },
        redirect: 'follow',
      });

      const responseTime = Date.now() - startTime;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      try {
        const json = JSON.parse(text);
        res.json({
          ...json,
          _meta: {
            endpoint: targetUrl,
            status: response.status,
            responseTimeMs: responseTime,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {
        res.json({
          success: response.ok,
          raw: text,
          _meta: {
            endpoint: targetUrl,
            status: response.status,
            contentType,
            responseTimeMs: responseTime,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error: any) {
      console.error('GAS GET Proxy Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Gagal menghubungi Google Apps Script',
      });
    }
  });

  // Proxy POST request to Google Apps Script
  app.post('/api/gas', async (req, res) => {
    try {
      const targetUrl = (req.query.url as string) || DEFAULT_GAS_URL;
      const payload = req.body;

      const startTime = Date.now();
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (AI Studio Penilaian Siswa Proxy)',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const responseTime = Date.now() - startTime;
      const text = await response.text();

      try {
        const json = JSON.parse(text);
        res.json({
          ...json,
          _meta: {
            endpoint: targetUrl,
            status: response.status,
            responseTimeMs: responseTime,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {
        res.json({
          success: response.ok,
          message: text,
          _meta: {
            endpoint: targetUrl,
            status: response.status,
            responseTimeMs: responseTime,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error: any) {
      console.error('GAS POST Proxy Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Gagal mengirim data ke Google Apps Script',
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
