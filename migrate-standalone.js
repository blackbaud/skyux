const glob = require('glob');
const fs = require('fs');

const files = glob.sync('{libs,apps}/**/*.ts');

for (const file of files) {
  const contents = fs.readFileSync(file, 'utf8');

  if (
    contents.includes('@Component(') &&
    !contents.includes('standalone: true')
  ) {
    const newContents = contents.replace('})', '  standalone: false\n})');
    fs.writeFileSync(file, newContents, 'utf8');
  }
}
