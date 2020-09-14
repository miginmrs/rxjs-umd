const fs = require('fs');
const pathlib = require('path');

const initial = ['internal'];
const startLength = initial.length;
const initialPath = pathlib.join(...initial);


function normalize(path) {
  return `${path.join('_').replace(/-/g, '_')}`;
}

function pathsIn(path, obj) {
  const dir = 'node_modules/rxjs/src/' + path;
  for (const seg of fs.readdirSync(dir)) {
    if (fs.lstatSync(pathlib.join(dir, seg)).isDirectory()) pathsIn(path + '/' + seg, obj[seg] = {});
    else if (seg.endsWith('.ts')) obj[seg.slice(0, -3)] = null;
  }
}

var rxjs = {};
pathsIn(initialPath, rxjs);
delete rxjs.Rx;

function* imports(path, obj) {
  if (obj === null) yield `import * as ${normalize(path)} from 'rxjs/src/${path.join('/')}';\n`;
  else for (const seg of Object.keys(obj)) yield* imports([...path, seg], obj[seg]);
}

function exports(path, obj) {
  const space = Array(path.length - startLength).fill('  ').join('');
  if (obj === null) return `${space}export const ${path.slice(-1)[0]} = ${normalize(path)};\n`;
  const content = `{\n${Object.keys(obj).map(seg => exports([...path, seg], obj[seg])).join('')}${space}}`;
  return space + `export namespace ${path.slice(-1)[0]} ${content};\n`;
};
fs.writeFileSync(pathlib.join(__dirname, 'rxjs-umd.ts'), `${[...imports(initial, rxjs)].join('')}

export * from 'rxjs/src/internal/umd';

${exports(initial, rxjs)}`);
