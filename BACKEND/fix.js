import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.js')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix routes: import router from express.Router() -> const router = express.Router();
  content = content.replace(/import\s+router\s+from\s+express\.Router\(\);?/g, 'const router = express.Router();');
  // Fix weird exports: exports.foo = ... -> export const foo = ...
  // Wait, exports.foo = ...
  // we can replace `exports.` with `export const ` at the start of line
  content = content.replace(/^exports\.(\w+)\s*=/gm, 'export const $1 =');

  // Fix requires: const { foo } = require("bar"); -> import { foo } from "bar";
  // This is tricky with regex, let's just do it cleanly for known patterns.
  // const foo = require('bar'); -> import foo from 'bar';
  content = content.replace(/const\s+([A-Za-z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g, 'import $1 from "$3";');
  
  // const { foo, bar } = require("baz"); -> import { foo, bar } from "baz";
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\((['"])(.*?)\2\);?/g, 'import { $1 } from "$3";');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed", filePath);
  }
}

// walk and process src
walkDir('./src', processFile);

// Fix server.js manually as it's the entrypoint and has specific issues
let serverStr = fs.readFileSync('server.js', 'utf8');
serverStr = serverStr.replace(/const\s+([a-zA-Z0-9]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import $1 from "$2.js";');
serverStr = serverStr.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import { $1 } from "$2.js";');

// Fix the '.js' extension missing in imports occasionally inside server.js
serverStr = serverStr.replace(/from\s+['"]([^'"]+?)(?<!\.js)['"]/g, (match, p1) => {
    if (p1.startsWith('.')) {
        return `from "${p1}.js"`;
    }
    return match;
});

// Since errorMiddleware might not have .js
// Just rewrite the chaotic routes block
serverStr = serverStr.replace(/import\s+testRoutes\s+from\s+".\/src\/routes\/testRoutes.js";/g, 'import testRoutes from "./src/routes/testRoutes.js";');

fs.writeFileSync('server.js', serverStr);
console.log("Fixed server.js");
