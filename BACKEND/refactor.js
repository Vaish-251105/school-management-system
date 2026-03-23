import fs from 'fs';
import path from 'path';

function fixFile(filePath, type) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Common require replacements
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import $1 from "$2";');
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import { $1 } from "$2";');

  if (type === 'controller' || type === 'middleware' || type === 'util') {
    content = content.replace(/^exports\.(\w+)\s*=/gm, 'export const $1 =');
    content = content.replace(/^module\.exports\s*=\s*\{/gm, 'export default {');
    content = content.replace(/^module\.exports\s*=\s*([^{]+);?/gm, 'export default $1;');
  }

  if (type === 'route') {
    // Specific route fixes
    content = content.replace(/import\s+router\s+from\s+express\.Router\(\);?/g, 'const router = express.Router();');
    content = content.replace(/import\s+router\s+from\s+['"]\.\/testRoutes\.js['"];?/g, 'const router = express.Router();');
    
    if (filePath.includes('testRoutes.js') && !content.includes('const router')) {
      content = content.replace(/router\.get/g, 'const router = express.Router();\n\nrouter.get');
    }

    content = content.replace(/import\s+([a-zA-Z0-9_]+Controller)\s+from\s+['"]([^'"]+Controller(\.js)?)['"];/g, 'import * as $1 from "$2";');
  }

  // Add .js to relative imports if missing
  content = content.replace(/from\s+['"](\.\.?[^'"]+)(?<!\.js)['"]/g, 'from "$1.js"');

  fs.writeFileSync(filePath, content, 'utf8');
}

['controllers', 'routes', 'middleware', 'utils'].forEach(dir => {
  const fullDir = path.join('./src', dir);
  if (fs.existsSync(fullDir)) {
    fs.readdirSync(fullDir).forEach(file => {
      if (file.endsWith('.js')) {
        fixFile(path.join(fullDir, file), dir.slice(0, -1));
      }
    });
  }
});

console.log('Refactor complete!');
