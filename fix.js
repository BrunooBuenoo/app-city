const fs = require('fs');

const files = [
  'src/components/layout/MapNavbar.tsx',
  'src/components/clima/botao-clima.tsx',
  'src/components/clima/card-clima.tsx'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  
  // Here is the list of original corrupted states from my grep
  // dark:-zinc-900/90 => dark:bg-zinc-900/90
  // dark:-zinc-800/50 => dark:border-zinc-800/50
  // dark:-zinc-100 => dark:text-zinc-100
  // dark:-zinc-800 => dark:bg-zinc-800 (except for borders, let's see)
  
  // Let's just fix it by looking at the context. It's actually safer to check out the previous state and re-apply.
  // Do I have git? Let's check git status.
});
