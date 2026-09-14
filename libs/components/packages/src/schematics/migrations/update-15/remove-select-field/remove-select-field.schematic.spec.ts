import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('remove-select-field.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  function setupTree(files: Record<string, string>): Tree {
    const tree = Tree.empty();

    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {},
          },
        },
      }),
    );

    tree.create(
      '/package.json',
      JSON.stringify({
        name: 'test',
        dependencies: {
          '@skyux/select-field': '^15.0.0',
          '@skyux/core': '^15.0.0',
        },
      }),
    );

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return tree;
  }

  async function runSchematic(tree: Tree): Promise<void> {
    await runner.runSchematic('remove-select-field', {}, tree);
  }

  function getDependencies(tree: Tree): Record<string, string> {
    return JSON.parse(tree.readText('/package.json')).dependencies;
  }

  it('should leave the module import and dependency untouched when a template uses <sky-select-field>', async () => {
    const moduleSource = `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
  exports: [SkySelectFieldModule],
})
export class SharedModule {}
`;

    const tree = setupTree({
      '/src/app/shared.module.ts': moduleSource,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-select-field></sky-select-field>`,
      // Scanning stops once a match is found, so a later file with its own
      // (irrelevant) template is never inspected.
      '/src/app/zzz-after.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-zzz-after',
  template: '<div></div>',
})
export class ZzzAfterComponent {}
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/shared.module.ts')).toBe(moduleSource);
    expect(getDependencies(tree)).toEqual({
      '@skyux/select-field': '^15.0.0',
      '@skyux/core': '^15.0.0',
    });
  });

  it('should leave the module import untouched when only an inline template uses <sky-select-field>', async () => {
    const moduleSource = `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
  exports: [SkySelectFieldModule],
})
export class SharedModule {}
`;

    const tree = setupTree({
      '/src/app/shared.module.ts': moduleSource,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<sky-select-field></sky-select-field>',
})
export class TestComponent {}
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/shared.module.ts')).toBe(moduleSource);
    expect(getDependencies(tree)).toEqual({
      '@skyux/select-field': '^15.0.0',
      '@skyux/core': '^15.0.0',
    });
  });

  it('should remove the module import and dependency when no template uses <sky-select-field>', async () => {
    const tree = setupTree({
      '/src/app/feature.module.ts': `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
})
export class FeatureModule {}
`,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/feature.module.ts'))
      .toBe(`import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
})
export class FeatureModule {}
`);
    expect(getDependencies(tree)).toEqual({ '@skyux/core': '^15.0.0' });
  });

  it('should remove the module from both imports and exports arrays when no template uses <sky-select-field>', async () => {
    const warnSpy = jest.fn();
    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    const tree = setupTree({
      '/src/app/shared.module.ts': `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
  exports: [SkySelectFieldModule],
})
export class SharedModule {}
`,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/shared.module.ts'))
      .toBe(`import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  exports: [],
})
export class SharedModule {}
`);
    expect(getDependencies(tree)).toEqual({ '@skyux/core': '^15.0.0' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should remove an aliased module import and dependency when no template uses <sky-select-field>', async () => {
    const tree = setupTree({
      '/src/app/feature.module.ts': `import { NgModule } from '@angular/core';
import { SkySelectFieldModule as SelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SelectFieldModule],
})
export class FeatureModule {}
`,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/feature.module.ts'))
      .toBe(`import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
})
export class FeatureModule {}
`);
    expect(getDependencies(tree)).toEqual({ '@skyux/core': '^15.0.0' });
  });

  it('should only rewrite the project that does not use <sky-select-field> in a multi-project workspace', async () => {
    const tree = setupTree({
      '/src/app/feature.module.ts': `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
})
export class FeatureModule {}
`,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
      '/projects/other/shared.module.ts': `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
  exports: [SkySelectFieldModule],
})
export class OtherSharedModule {}
`,
      '/projects/other/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-other-test',
  templateUrl: './test.component.html',
})
export class OtherTestComponent {}
`,
      '/projects/other/test.component.html': `<sky-select-field></sky-select-field>`,
    });

    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {},
          },
          other: {
            projectType: 'application',
            root: 'projects/other',
            sourceRoot: 'projects/other',
            architect: {},
          },
        },
      }),
    );

    await runSchematic(tree);

    expect(tree.readText('/src/app/feature.module.ts'))
      .toBe(`import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
})
export class FeatureModule {}
`);
    expect(tree.readText('/projects/other/shared.module.ts')).toBe(
      `import { NgModule } from '@angular/core';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  imports: [SkySelectFieldModule],
  exports: [SkySelectFieldModule],
})
export class OtherSharedModule {}
`,
    );
    expect(getDependencies(tree)).toEqual({
      '@skyux/select-field': '^15.0.0',
      '@skyux/core': '^15.0.0',
    });
  });

  it('should keep the import and warn when SkySelectFieldModule is referenced outside a decorator imports array', async () => {
    const warnSpy = jest.fn();
    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    const source = `import { SkySelectFieldModule } from '@skyux/select-field';

const modules = [SkySelectFieldModule];

export { modules };
`;

    const tree = setupTree({
      '/src/app/modules.ts': source,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/modules.ts')).toBe(source);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('SkySelectFieldModule'),
    );
  });

  it('should ignore an unrelated local class named SkySelectFieldModule', async () => {
    const source = `import { SkySelectFieldModule } from './local-select-field-module';

export class SharedModule {
  modules = [SkySelectFieldModule];
}
`;

    const tree = setupTree({
      '/src/app/shared.module.ts': source,
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}
`,
      '/src/app/test.component.html': `<sky-lookup></sky-lookup>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/shared.module.ts')).toBe(source);
    // Nothing in the project actually imports `@skyux/select-field`, so the
    // dependency is still correctly dropped even though a local class shares
    // the deprecated module's name.
    expect(getDependencies(tree)).toEqual({ '@skyux/core': '^15.0.0' });
  });
});
