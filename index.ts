import "reflect-metadata";
import { Core } from './core/core';
import orderRoutes from './api/routes/order.route';

const core = new Core();
core.init();
const router = core.router;

orderRoutes(router);

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res
    .status(404)
    .end(
      "<body style='background-color: black'><p style='color: white'> Hello Worlds </p></body>",
    );
});


/* Ingore
"compilerOptions": {
  "module": "ESNext",
  "allowImportingTsExtensions": true,
  "noEmit": true,
  "moduleResolution": "bundler",
  "target": "ES2023",
  "strict": true,
  "esModuleInterop": true,
  "ignoreDeprecations": "6.0",
  "strictPropertyInitialization": false,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
}*/

/*
{
  "compilerOptions": {
    "types": [
      "node"
    ],
    "outDir": "./dist",
    "rootDir": ".",
    "module": "CommonJS",
    "moduleResolution": "node",
    "target": "ES2023",
    "esModuleInterop": true,
    "strictPropertyInitialization": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noImplicitAny": false,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
*/