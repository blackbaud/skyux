import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { VERSION } from '@angular/cli';

import { installAngularCdk } from './install-angular-cdk';

describe('install-angular-cdk', () => {
  it('should install the Angular CDK', async () => {
    const tree = Tree.empty();
    tree.create('package.json', JSON.stringify({}));
    const context = { addTask: jest.fn() } as unknown as SchematicContext;
    const rule = installAngularCdk();
    await rule(tree, context);
    expect(context.addTask).toHaveBeenCalled();
    expect(tree.readJson('package.json')).toEqual({
      dependencies: {
        '@angular/cdk': `^${VERSION.major}.0.0`,
      },
    });
  });
});
