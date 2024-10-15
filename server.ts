import express, { NextFunction, Request, Response } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { environment } from './src/environments/environment';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Define the backend API URL
  const BACKEND_URL =
    environment.BACKEND_URL ||
    'https://recipe-book-mean-backend.onrender.com/api/recipes';

  // Proxy middleware for API calls
  server.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/recipes', // Ensures the /api prefix is maintained in requests
      },
    })
  );

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    })
  );

  // Serve the index.html file for all non-static requests
  server.get('/*', (req: Request, res: Response) => {
    res.sendFile(join(browserDistFolder, 'index.html'));
  });

  server.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });

  // Global error handling middleware
  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).send('Something broke!');
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
