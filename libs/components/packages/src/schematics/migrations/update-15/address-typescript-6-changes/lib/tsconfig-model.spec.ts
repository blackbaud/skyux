import { HostTree } from '@angular-devkit/schematics';

import {
  buildTsconfigModel,
  TsconfigInfo,
  TsconfigModel,
} from './tsconfig-model';

function getConfig(model: TsconfigModel, path: string): TsconfigInfo {
  const config = model.get(path);
  if (!config) {
    throw new Error(`Expected a config at "${path}".`);
  }
  return config;
}

describe('tsconfig-model', () => {
  describe('discovery', () => {
    it('should return no configs when the tree has no tsconfig files', () => {
      const tree = new HostTree();
      tree.create('/package.json', '{}');

      const model = buildTsconfigModel(tree);

      expect(model.getAll()).toHaveLength(0);
    });

    it('should discover a root tsconfig.json', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', '{}');

      const model = buildTsconfigModel(tree);

      expect(model.get('/tsconfig.json')).toBeDefined();
    });

    it('should discover project-level tsconfig files', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', '{}');
      tree.create('/tsconfig.app.json', '{}');
      tree.create('/tsconfig.spec.json', '{}');

      const model = buildTsconfigModel(tree);

      expect(
        model
          .getAll()
          .map((c) => c.path)
          .sort(),
      ).toEqual([
        '/tsconfig.app.json',
        '/tsconfig.json',
        '/tsconfig.spec.json',
      ]);
    });
  });

  describe('getEffectiveBaseUrl', () => {
    it('should return the config own baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');
      const effective = model.getEffectiveBaseUrl(config);

      expect(effective?.value).toBe('./src');
      expect(effective?.definedIn.path).toBe('/tsconfig.json');
    });

    it('should return undefined when no config defines a baseUrl', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');

      expect(model.getEffectiveBaseUrl(config)).toBeUndefined();
    });

    it('should walk an extends chain to find an inherited baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './' } }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({ extends: './tsconfig.json', compilerOptions: {} }),
      );

      const model = buildTsconfigModel(tree);
      const child = getConfig(model, '/tsconfig.app.json');
      const effective = model.getEffectiveBaseUrl(child);

      expect(effective?.value).toBe('./');
      expect(effective?.definedIn.path).toBe('/tsconfig.json');
    });

    it('should prefer the config own baseUrl over an inherited one', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './' } }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({
          extends: './tsconfig.json',
          compilerOptions: { baseUrl: './src' },
        }),
      );

      const model = buildTsconfigModel(tree);
      const child = getConfig(model, '/tsconfig.app.json');
      const effective = model.getEffectiveBaseUrl(child);

      expect(effective?.value).toBe('./src');
      expect(effective?.definedIn.path).toBe('/tsconfig.app.json');
    });

    it('should let the last entry of an extends array win', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.a.json',
        JSON.stringify({ compilerOptions: { baseUrl: './a' } }),
      );
      tree.create(
        '/tsconfig.b.json',
        JSON.stringify({ compilerOptions: { baseUrl: './b' } }),
      );
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          extends: ['./tsconfig.a.json', './tsconfig.b.json'],
          compilerOptions: {},
        }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');
      const effective = model.getEffectiveBaseUrl(config);

      expect(effective?.value).toBe('./b');
      expect(effective?.definedIn.path).toBe('/tsconfig.b.json');
    });

    it('should gracefully ignore an extends reference to a missing file', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          extends: './does-not-exist.json',
          compilerOptions: {},
        }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');

      expect(model.getEffectiveBaseUrl(config)).toBeUndefined();
    });

    it('should gracefully handle an extends cycle', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.a.json',
        JSON.stringify({ extends: './tsconfig.b.json', compilerOptions: {} }),
      );
      tree.create(
        '/tsconfig.b.json',
        JSON.stringify({ extends: './tsconfig.a.json', compilerOptions: {} }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.a.json');

      expect(model.getEffectiveBaseUrl(config)).toBeUndefined();
    });

    it('should resolve an extends reference to a node_modules package', () => {
      const tree = new HostTree();
      tree.create(
        '/node_modules/@tsconfig/base/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './' } }),
      );
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          extends: '@tsconfig/base/tsconfig.json',
          compilerOptions: {},
        }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');
      const effective = model.getEffectiveBaseUrl(config);

      expect(effective?.value).toBe('./');
      expect(effective?.definedIn.inNodeModules).toBe(true);
    });
  });

  describe('getEffectivePaths', () => {
    it("should not merge a child's paths with an extended config's paths", () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { paths: { '@lib/*': ['projects/lib/src/*'] } },
        }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({
          extends: './tsconfig.json',
          compilerOptions: { paths: { '@app/*': ['src/app/*'] } },
        }),
      );

      const model = buildTsconfigModel(tree);
      const child = getConfig(model, '/tsconfig.app.json');
      const effective = model.getEffectivePaths(child);

      expect(effective?.value).toEqual({ '@app/*': ['src/app/*'] });
    });

    it('should inherit paths from an extended config when none are declared locally', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { paths: { '@lib/*': ['projects/lib/src/*'] } },
        }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({ extends: './tsconfig.json', compilerOptions: {} }),
      );

      const model = buildTsconfigModel(tree);
      const child = getConfig(model, '/tsconfig.app.json');
      const effective = model.getEffectivePaths(child);

      expect(effective?.value).toEqual({ '@lib/*': ['projects/lib/src/*'] });
      expect(effective?.definedIn.path).toBe('/tsconfig.json');
    });
  });

  describe('getEffectiveOption', () => {
    it("should read the config's own compiler option", () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { module: 'preserve' } }),
      );

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');

      expect(model.getEffectiveOption(config, 'module')).toBe('preserve');
    });

    it('should walk the extends chain for a compiler option', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { module: 'preserve' } }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({ extends: './tsconfig.json', compilerOptions: {} }),
      );

      const model = buildTsconfigModel(tree);
      const child = getConfig(model, '/tsconfig.app.json');

      expect(model.getEffectiveOption(child, 'module')).toBe('preserve');
    });

    it('should return undefined when no config in the chain defines the option', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));

      const model = buildTsconfigModel(tree);
      const config = getConfig(model, '/tsconfig.json');

      expect(model.getEffectiveOption(config, 'module')).toBeUndefined();
    });
  });

  describe('getGoverningBaseUrl', () => {
    it('should resolve the absolute baseUrl for a file in the same directory', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/foo.ts', '');

      const model = buildTsconfigModel(tree);
      const governing = model.getGoverningBaseUrl('/src/app/foo.ts');

      expect(governing?.baseUrlAbs).toBe('/src');
    });

    it('should walk up directories to find a governing config', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/nested/deep/foo.ts', '');

      const model = buildTsconfigModel(tree);
      const governing = model.getGoverningBaseUrl(
        '/src/app/nested/deep/foo.ts',
      );

      expect(governing?.baseUrlAbs).toBe('/src');
    });

    it('should return the effective paths patterns alongside the baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@app/*': ['src/app/*'] },
          },
        }),
      );
      tree.create('/src/foo.ts', '');

      const model = buildTsconfigModel(tree);
      const governing = model.getGoverningBaseUrl('/src/foo.ts');

      expect(governing?.pathsPatterns).toEqual(['@app/*']);
    });

    it('should return undefined when no config in the tree defines a baseUrl', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/src/foo.ts', '');

      const model = buildTsconfigModel(tree);

      expect(model.getGoverningBaseUrl('/src/foo.ts')).toBeUndefined();
    });

    it('should prefer tsconfig.json over other configs in the same directory', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create(
        '/tsconfig.other.json',
        JSON.stringify({ compilerOptions: { baseUrl: './other' } }),
      );
      tree.create('/src/foo.ts', '');

      const model = buildTsconfigModel(tree);
      const governing = model.getGoverningBaseUrl('/src/foo.ts');

      expect(governing?.baseUrlAbs).toBe('/src');
    });

    it('should flag conflicting effective baseUrls in the same directory', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.a.json',
        JSON.stringify({ compilerOptions: { baseUrl: './a' } }),
      );
      tree.create(
        '/tsconfig.b.json',
        JSON.stringify({ compilerOptions: { baseUrl: './b' } }),
      );
      tree.create('/foo.ts', '');

      const model = buildTsconfigModel(tree);
      const governing = model.getGoverningBaseUrl('/foo.ts');

      expect(governing?.conflictingConfigPaths).toBeDefined();
      expect(governing?.conflictingConfigPaths?.length).toBeGreaterThan(0);
    });
  });
});
