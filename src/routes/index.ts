import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Dynamically load all route files in the current directory
const routesDir = __dirname;
fs.readdirSync(routesDir).forEach((file) => {
  if (file !== 'index.ts' && file.endsWith('.ts')) {
    const routePath = path.join(routesDir, file);
    const route = require(routePath).default;
    // Attach the route to the router
    router.use('/', route);
  }
});

export default router;
