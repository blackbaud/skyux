import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

fdescribe('Migrations > Replace disabled class with attribute', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('replace-disabled-class-with-attribute', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should replace simple sky-btn-disabled class with [disabled]="true"', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = stripIndents`
<div>
  <button class="sky-btn-disabled">Disabled Button</button>
</div>
    `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    expect(updatedContent).toBe(stripIndents`
<div>
  <button [disabled]="true">Disabled Button</button>
</div>`);
  });

  it('should replace sky-btn-disabled class while preserving the other classes', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = stripIndents`
  <div>
    <button aria-label="something" class="sky-btn sky-btn-disabled sky-btn-primary">Button</button>
    <button class="sky-btn-disabled other-class">Another Button</button>
    <button class="sky-btn sky-btn-disabled">Even More Button</button>
  </div>
      `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    expect(updatedContent).toBe(stripIndents`
  <div>
    <button aria-label="something" class="sky-btn sky-btn-primary" [disabled]="true">Button</button>
    <button class="other-class" [disabled]="true">Another Button</button>
    <button class="sky-btn" [disabled]="true">Even More Button</button>
  </div>`);
  });

  it('should replace [class.sky-btn-disabled] with [disabled] attribute', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = stripIndents`
  <div>
    <button [class.sky-btn-disabled]="isDisabled">Conditional Button</button>
    <button class="sky-btn" [class.sky-btn-disabled]="formControl.disabled">Form Button</button>
  </div>
      `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    expect(updatedContent).toBe(stripIndents`
        <div>
          <button [disabled]="isDisabled">Conditional Button</button>
          <button class="sky-btn" [disabled]="formControl.disabled">Form Button</button>
        </div>
      `);
  });

  it('should replace ngClass with sky-btn-disabled', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = stripIndents`
    <div>
      <button [ngClass]="{'sky-btn-disabled': isButtonDisabled}">Button 1</button>
      <button [ngClass]="{'sky-btn': true, 'sky-btn-disabled': shouldDisable, 'primary': isPrimary}">Button 2</button>
      <button [ngClass]="{'sky-btn': true, 'sky-btn-disabled': shouldDisable}">Button 3</button>
      <button [disabled]="true" [ngClass]="{'sky-btn': true, 'sky-btn-disabled': shouldDisable}">Button 4</button>
    </div>
        `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    expect(updatedContent).toBe(stripIndents`
    <div>
      <button [disabled]="isButtonDisabled">Button 1</button>
      <button [disabled]="shouldDisable" [ngClass]="{'sky-btn': true, 'primary': isPrimary}">Button 2</button>
      <button [disabled]="shouldDisable" [ngClass]="{'sky-btn': true}">Button 3</button>
      <button [disabled]="true" [ngClass]="{'sky-btn': true}">Button 4</button>
    </div>`);
  });

  it('should not add duplicate [disabled] attribute if it already exists', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = stripIndents`
  <div>
    <button class="sky-btn-disabled" [disabled]="existingCondition">Button 1</button>
    <button class="sky-btn sky-btn-disabled" disabled="true">Button 2</button>
    <button [disabled]="existingCondition" class="sky-btn-disabled">Button 1</button>
    <button disabled="true" class="sky-btn sky-btn-disabled">Button 2</button>
  </div>
      `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    // Should remove class but keep existing disabled attribute
    expect(updatedContent).toBe(stripIndents`
  <div>
    <button [disabled]="existingCondition">Button 1</button>
    <button class="sky-btn" disabled="true">Button 2</button>
    <button [disabled]="existingCondition">Button 1</button>
    <button disabled="true" class="sky-btn">Button 2</button>
  </div>`);
  });

  it('should handle multiple occurrences in the same file', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = `
  <div>
    <button class="sky-btn-disabled">Button 1</button>
    <button class="sky-btn sky-btn-disabled">Button 2</button>
    <button [class.sky-btn-disabled]="condition">Button 3</button>
    <span class="sky-btn-disabled">Not a button</span>
  </div>
      `;

    tree.create('/src/app/test.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.html');

    const disabledMatches = updatedContent.match(/\[disabled\]="true"/g);
    const conditionalDisabledMatches = updatedContent.match(
      /\[disabled\]="condition"/g,
    );

    expect(disabledMatches).toHaveLength(3); // Three static disabled
    expect(conditionalDisabledMatches).toHaveLength(1); // One conditional disabled
    expect(updatedContent).not.toContain('sky-btn-disabled');
  });

  it('should not modify files that do not contain sky-btn-disabled', async () => {
    const { tree, runSchematic } = await setup();

    const originalContent = `
  <div>
    <button class="sky-btn sky-btn-primary">Normal Button</button>
    <button [disabled]="someCondition">Already Disabled</button>
    <div class="some-other-disabled-class">Not related</div>
  </div>
      `;

    tree.create('/src/app/clean.component.html', originalContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/clean.component.html',
    );

    expect(updatedContent).toBe(originalContent);
  });

  it('should only process HTML files', async () => {
    const { tree, runSchematic } = await setup();

    const tsContent = `
  export class TestComponent {
    className = 'sky-btn-disabled';
    template = '<button class="sky-btn-disabled">Button</button>';
  }
      `;

    const scssContent = `
  .sky-btn-disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
      `;

    tree.create('/src/app/test.component.ts', tsContent);
    tree.create('/src/app/test.component.scss', scssContent);

    const updatedTree = await runSchematic();

    const updatedTsContent = updatedTree.readText('/src/app/test.component.ts');
    const updatedScssContent = updatedTree.readText(
      '/src/app/test.component.scss',
    );

    // These files should remain unchanged since they're not HTML
    expect(updatedTsContent).toBe(tsContent);
    expect(updatedScssContent).toBe(scssContent);
  });

  it('should handle complex HTML structures', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = `
  <div class="container">
    <form>
      <div class="form-group">
        <button
          type="submit"
          class="sky-btn sky-btn-primary sky-btn-disabled"
          id="submit-btn"
          data-testid="submit">
          Submit
        </button>
      </div>
      <div class="button-group">
        <button
          [class.sky-btn-disabled]="!isValid"
          [attr.aria-label]="buttonLabel">
          Dynamic Button
        </button>
      </div>
    </form>
  </div>
      `;

    tree.create('/src/app/complex.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/complex.component.html',
    );

    expect(updatedContent).toContain(
      'class="sky-btn sky-btn-primary" [disabled]="true"',
    );
    expect(updatedContent).toContain('[disabled]="!isValid"');
    expect(updatedContent).not.toContain('sky-btn-disabled');

    // Verify other attributes are preserved
    expect(updatedContent).toContain('type="submit"');
    expect(updatedContent).toContain('id="submit-btn"');
    expect(updatedContent).toContain('data-testid="submit"');
    expect(updatedContent).toContain('[attr.aria-label]="buttonLabel"');
  });

  it('should handle edge cases with quotes and special characters', async () => {
    const { tree, runSchematic } = await setup();

    const htmlContent = `
  <div>
    <button [class.sky-btn-disabled]="user?.isDisabled || form.invalid">Complex Condition</button>
    <button [class.sky-btn-disabled]="checkStatus('disabled')">Function Call</button>
  </div>
      `;

    tree.create('/src/app/edge-cases.component.html', htmlContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/edge-cases.component.html',
    );

    expect(updatedContent).toContain(
      '[disabled]="user?.isDisabled || form.invalid"',
    );
    expect(updatedContent).toContain('[disabled]="checkStatus(\'disabled\')"');
    expect(updatedContent).not.toContain('sky-btn-disabled');
  });
});
