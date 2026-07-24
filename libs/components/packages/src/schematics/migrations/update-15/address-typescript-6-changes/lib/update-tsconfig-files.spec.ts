import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';

import { JsonFile } from '../../../../utility/json-file';

import { buildTsconfigModel } from './tsconfig-model';
import { updateTsconfigFiles } from './update-tsconfig-files';

function createContext(): {
  context: SchematicContext;
  warn: jest.SpyInstance;
} {
  const context: Pick<SchematicContext, 'logger'> = {
    logger: new logging.NullLogger(),
  };
  const warn = jest.spyOn(context.logger, 'warn');

  return { context: context as SchematicContext, warn };
}

function run(tree: HostTree, context: SchematicContext): void {
  const model = buildTsconfigModel(tree);
  updateTsconfigFiles(tree, model, context);
}

describe('update-tsconfig-files', () => {
  describe('baseUrl removal', () => {
    it("should remove the config's own baseUrl", () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'baseUrl',
        ]),
      ).toBeUndefined();
    });

    it('should not throw when no config defines a baseUrl', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));

      const { context } = createContext();

      expect(() => run(tree, context)).not.toThrow();
    });

    it('should warn and not edit when the effective baseUrl is inherited from node_modules', () => {
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

      const { context, warn } = createContext();
      run(tree, context);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('/tsconfig.json'),
      );
      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions']),
      ).toEqual({});
    });
  });

  describe('paths rebasing', () => {
    it('should rebase a paths value relative to the config directory', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@lib/*': ['projects/lib/src/*'] },
          },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'paths',
          '@lib/*',
        ]),
      ).toEqual(['./projects/lib/src/*']);
    });

    it('should rebase a paths value when baseUrl is a subdirectory', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './src',
            paths: { '@app/*': ['app/*'] },
          },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'paths',
          '@app/*',
        ]),
      ).toEqual(['./src/app/*']);
    });

    it('should not change an already-relative value when the config dir already matches the baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@app/*': ['./src/app/*'] },
          },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'paths',
          '@app/*',
        ]),
      ).toEqual(['./src/app/*']);
    });

    it('should re-relativize an already-relative value across directories using "../"', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './' } }),
      );
      tree.create(
        '/projects/app/tsconfig.json',
        JSON.stringify({
          extends: '../../tsconfig.json',
          compilerOptions: { paths: { '@lib/*': ['./projects/lib/src/*'] } },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/projects/app/tsconfig.json').get([
          'compilerOptions',
          'paths',
          '@lib/*',
        ]),
      ).toEqual(['../lib/src/*']);
    });

    it('should not attempt to rebase paths when no config defines a baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { paths: { '@app/*': ['./src/app/*'] } },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'paths',
          '@app/*',
        ]),
      ).toEqual(['./src/app/*']);
    });

    it('should tolerate a non-array paths alias value', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@app/*': 'not-an-array' },
          },
        }),
      );

      const { context } = createContext();

      expect(() => run(tree, context)).not.toThrow();
    });
  });

  describe('deprecated option removal', () => {
    it.each([
      ['downlevelIteration', true],
      ['downlevelIteration', false],
      ['outFile', './out.js'],
    ])('should remove "%s" set to %p', (option, value) => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { [option]: value } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', option]),
      ).toBeUndefined();
    });

    it.each([
      'alwaysStrict',
      'esModuleInterop',
      'allowSyntheticDefaultImports',
    ])('should remove "%s" when set to false', (option) => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { [option]: false } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', option]),
      ).toBeUndefined();
    });
  });

  describe('TS6-default option removal', () => {
    it.each([
      'strict',
      'alwaysStrict',
      'esModuleInterop',
      'allowSyntheticDefaultImports',
    ])('should remove "%s" when set to true', (option) => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { [option]: true } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', option]),
      ).toBeUndefined();
    });

    it('should remove an empty "types" array', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { types: [] } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', 'types']),
      ).toBeUndefined();
    });

    it('should keep a non-empty "types" array', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { types: ['jasmine'] } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', 'types']),
      ).toEqual(['jasmine']);
    });

    it('should keep "strict: false"', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { strict: false } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', 'strict']),
      ).toBe(false);
    });

    it('should remove "moduleResolution: bundler" when the effective module is "preserve"', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { module: 'preserve', moduleResolution: 'bundler' },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'moduleResolution',
        ]),
      ).toBeUndefined();
    });

    it('should remove "moduleResolution: bundler" when "module: preserve" is inherited', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { module: 'preserve' } }),
      );
      tree.create(
        '/tsconfig.app.json',
        JSON.stringify({
          extends: './tsconfig.json',
          compilerOptions: { moduleResolution: 'bundler' },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.app.json').get([
          'compilerOptions',
          'moduleResolution',
        ]),
      ).toBeUndefined();
    });

    it('should keep "moduleResolution: bundler" when the effective module is not "preserve"', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { module: 'ES2022', moduleResolution: 'bundler' },
        }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get([
          'compilerOptions',
          'moduleResolution',
        ]),
      ).toBe('bundler');
    });

    it('should never remove "target"', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { target: 'ES2022' } }),
      );

      const { context } = createContext();
      run(tree, context);

      expect(
        new JsonFile(tree, '/tsconfig.json').get(['compilerOptions', 'target']),
      ).toBe('ES2022');
    });
  });

  describe('deprecated-value warnings', () => {
    it.each([
      ['target', 'es3'],
      ['target', 'es5'],
      ['module', 'none'],
      ['module', 'amd'],
      ['module', 'umd'],
      ['module', 'system'],
      ['moduleResolution', 'node10'],
      ['moduleResolution', 'classic'],
      ['moduleResolution', 'node'],
    ])('should warn when "%s" is "%s"', (option, value) => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { [option]: value } }),
      );

      const { context, warn } = createContext();
      run(tree, context);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('/tsconfig.json'),
      );
    });

    it('should not warn for a clean workspace', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: { target: 'ES2022', module: 'preserve' },
        }),
      );

      const { context, warn } = createContext();
      run(tree, context);

      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('comment preservation', () => {
    it('should preserve file-leading comments after edits', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        [
          '/* To learn more about Typescript configuration file: ... */',
          '/* To learn more about Angular compiler options: ... */',
          '{',
          '  "compilerOptions": {',
          '    "baseUrl": "./src",',
          '    "target": "ES2022"',
          '  }',
          '}',
        ].join('\n'),
      );

      const { context } = createContext();
      run(tree, context);

      const content = tree.readText('/tsconfig.json');
      expect(content).toContain(
        '/* To learn more about Typescript configuration file: ... */',
      );
      expect(content).toContain(
        '/* To learn more about Angular compiler options: ... */',
      );
      expect(content).not.toContain('baseUrl');
    });
  });

  describe('idempotency', () => {
    it('should make no further changes on a second run', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './src',
            paths: { '@app/*': ['app/*'] },
            strict: true,
            downlevelIteration: true,
          },
        }),
      );

      const { context } = createContext();
      run(tree, context);
      const firstPass = tree.readText('/tsconfig.json');

      run(tree, context);
      const secondPass = tree.readText('/tsconfig.json');

      expect(secondPass).toBe(firstPass);
    });
  });
});
