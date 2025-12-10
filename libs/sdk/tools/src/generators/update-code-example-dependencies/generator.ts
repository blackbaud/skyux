import {
  Tree,
  formatFiles,
  readCachedProjectGraph,
  readJson,
  updateJson,
} from '@nx/devkit';

function updateCodeExampleDependencies(tree: Tree): void {
  const rootPackageJson = readJson(tree, 'package.json');
  const rootDependencies = Object.fromEntries([
    ...Object.entries(rootPackageJson.dependencies),
    ...Object.entries(rootPackageJson.devDependencies),
  ]);
  const graph = readCachedProjectGraph();
  const projectPackages = Object.values(graph.nodes)
    .filter(
      (node) => node.type === 'lib' && node.data.metadata?.js?.packageName,
    )
    .map((node) => node.data.metadata?.js?.packageName as string);
  updateJson(
    tree,
    'apps/code-examples/src/assets/stack-blitz/package.json',
    (json) => {
      ['dependencies', 'devDependencies'].forEach((dependencyType) => {
        if (dependencyType in json) {
          const dependencies = json[dependencyType] as Record<string, string>;
          for (const [name, version] of Object.entries(dependencies)) {
            if (projectPackages.includes(name)) {
              json[dependencyType][name] = `^${rootPackageJson.version}`;
            } else if (name in rootDependencies) {
              const rootVersion = rootDependencies[name];
              const prefix = version.match(`^[~^]`) ? version.charAt(0) : '';
              json[dependencyType][name] = `${prefix}${rootVersion}`;
            }
          }
        }
      });
      return json;
    },
  );
}

export default async function (
  tree: Tree,
  options: { skipFormat: boolean },
): Promise<void> {
  updateCodeExampleDependencies(tree);
  /* istanbul ignore if */
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}
