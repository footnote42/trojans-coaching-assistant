const fs = require('fs');
const parser = require('@babel/parser');

try {
  const code = fs.readFileSync('client/src/App.tsx', 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log('✓ JSX/TSX parsing successful - no syntax errors found');
} catch (err) {
  console.log('✗ Parse error:', err.message);
  if (err.loc) {
    console.log(`  at line ${err.loc.line}, column ${err.loc.column}`);
  }
}
