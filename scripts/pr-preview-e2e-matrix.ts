import { readFileSync } from 'fs';

const projects = JSON.parse(readFileSync(0).toString());

const include = projects.map((project: string) => {
  return {
    project,
    token: `PERCY_TOKEN_${project.toUpperCase().replace(/-/g, '_')}_E2E`,
  };
});

console.log(JSON.stringify({ include }));
