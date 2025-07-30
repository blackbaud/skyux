import { logging } from '@angular-devkit/core';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { parseSourceFile } from '@angular/cdk/schematics';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';

import { firstValueFrom } from 'rxjs';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from '../../testing/angular-module-generator';
import { createTestApp } from '../../testing/scaffold';
import { addSymbolToClassMetadata } from '../../utility/typescript/ng-ast';

import { convertSelectFieldToLookup } from './convert-select-field-to-lookup';

describe('Convert select field to lookup', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should convert select field to lookup', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      flat: true,
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      standalone: false,
      module: 'test',
      flat: true,
    });
    const input = stripIndents`
      <sky-select-field
        *ngIf="true"
        name="modelValue"
        [ariaLabel]="ariaLabel"
        [ariaLabelledBy]="ariaLabelledBy"
        [customPicker]="customPicker"
        [data]="data"
        [descriptorKey]="descriptorKey"
        [disabled]="disabled"
        [inMemorySearchEnabled]="inMemorySearchEnabled"
        [multipleSelectOpenButtonText]="multipleSelectOpenButtonText"
        [selectMode]="selectMode"
        [singleSelectClearButtonTitle]="singleSelectClearButtonTitle"
        [singleSelectOpenButtonTitle]="singleSelectOpenButtonTitle"
        [singleSelectPlaceholderText]="singleSelectPlaceholderText"
        [pickerHeading]="pickerHeading"
        [(ngModel)]="formData.modelValue"
        (blur)="onBlur()"
        (ngModelChange)="onModelChange($event)"
        (searchApplied)="onSearchApplied($event)"
      />
    `;
    applyChangesToFile(
      tree,
      'src/app/test.module.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.module.ts'),
        'NgModule',
        'src/app/test.module.ts',
        'imports',
        'NgIf',
        '@angular/common',
      ),
    );
    applyChangesToFile(
      tree,
      'src/app/test.module.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.module.ts'),
        'NgModule',
        'src/app/test.module.ts',
        'imports',
        'NgModel',
        '@angular/forms',
      ),
    );
    applyChangesToFile(
      tree,
      'src/app/test.module.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.module.ts'),
        'NgModule',
        'src/app/test.module.ts',
        'imports',
        'SkySelectFieldModule',
        '@skyux/select-field',
      ),
    );
    tree.overwrite('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-lookup
        *ngIf="true"
        name="modelValue"
        [ariaLabel]="ariaLabel"
        [ariaLabelledBy]="ariaLabelledBy"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="data | async"
        [descriptorProperty]="descriptorKey"
        [disabled]="disabled"
        [selectMode]="selectMode"
        [placeholderText]="singleSelectPlaceholderText"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        idProperty="id" />
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup('', {
          bestEffortMode: true,
          insertTodos: true,
          projectPath: '',
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
    expect(
      stripIndents`${tree.readText('src/app/test.module.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert select field to lookup using template expressions', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      standalone: true,
      flat: true,
    });
    const input = stripIndents`
      <sky-select-field
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [customPicker]="customPicker"
        [data]="data"
        [disabled]="disabled"
        [inMemorySearchEnabled]="inMemorySearchEnabled"
        [multipleSelectOpenButtonText]="multipleSelectOpenButtonText"
        [selectMode]="selectMode"
        [singleSelectClearButtonTitle]="singleSelectClearButtonTitle"
        [singleSelectOpenButtonTitle]="singleSelectOpenButtonTitle"
        singleSelectPlaceholderText="{{ singleSelectPlaceholderText }}"
        pickerHeading="{{ pickerHeading }}"
        [(ngModel)]="formData.modelValue"
        (blur)="onBlur()"
        (ngModelChange)="onModelChange($event)"
        (searchApplied)="onSearchApplied($event)"
      />
    `;
    tree.overwrite('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-lookup
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="data | async"
        [disabled]="disabled"
        [selectMode]="selectMode"
        placeholderText="{{ singleSelectPlaceholderText }}"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        descriptorProperty="label"
        idProperty="id" />
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup('', {
          bestEffortMode: true,
          insertTodos: true,
          projectPath: '',
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      standalone: true,
      flat: true,
    });
    tree.overwrite('src/app/test.component.html', '<sky-select-field');
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup('', {
          bestEffortMode: true,
          insertTodos: true,
          projectPath: '',
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      '<sky-select-field',
    );
  });

  it('should convert inline template', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkySelectFieldModule } from '@skyux/select-field';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-select-field
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data"
            [descriptorKey]="descriptorKey"
            [disabled]="disabled"
            [inMemorySearchEnabled]="inMemorySearchEnabled"
            [multipleSelectOpenButtonText]="multipleSelectOpenButtonText"
            [selectMode]="selectMode"
            [singleSelectClearButtonTitle]="singleSelectClearButtonTitle"
            [singleSelectOpenButtonTitle]="singleSelectOpenButtonTitle"
            singleSelectPlaceholderText="Placeholder Text"
            pickerHeading="Picker Heading"
            [showAddNewRecordButton]="true"
            [(ngModel)]="formData.modelValue"
            (blur)="onBlur)"
            (ngModelChange)="onModelChange($event)"
            (addNewRecordButtonClick)="onAddNewRecordButtonClick()"
            (searchApplied)="onSearchApplied($event)"
          ></sky-select-field>
        ${backtick},
        imports: [SkySelectFieldModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';

      import { SkyLookupModule } from '@skyux/lookup';
      import { AsyncPipe } from '@angular/common';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-lookup
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data | async"
            [descriptorProperty]="descriptorKey"
            [disabled]="disabled"
            [selectMode]="selectMode"
            placeholderText="Placeholder Text"
            [showMoreConfig]="{ nativePickerConfig: { title: 'Picker Heading' } }"
            [showAddButton]="true"
            [(ngModel)]="formData.modelValue"
            (ngModelChange)="onModelChange($event)"
            (addClick)="onAddNewRecordButtonClick()"
            idProperty="id"></sky-lookup>
        ${backtick},
        imports: [SkyLookupModule, AsyncPipe],
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup('', {
          bestEffortMode: true,
          insertTodos: true,
          projectPath: '',
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should convert inline template with module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        standalone: false,
        template: ${backtick}
          <sky-select-field
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data"
            [descriptorKey]="descriptorKey"
            [disabled]="disabled"
            [inMemorySearchEnabled]="inMemorySearchEnabled"
            [multipleSelectOpenButtonText]="multipleSelectOpenButtonText"
            [selectMode]="selectMode"
            [singleSelectClearButtonTitle]="singleSelectClearButtonTitle"
            [singleSelectOpenButtonTitle]="singleSelectOpenButtonTitle"
            singleSelectPlaceholderText="Placeholder Text"
            pickerHeading="Picker Heading"
            [showAddNewRecordButton]="true"
            [(ngModel)]="formData.modelValue"
            (blur)="onBlur)"
            (ngModelChange)="onModelChange($event)"
            (addNewRecordButtonClick)="onAddNewRecordButtonClick()"
            (searchApplied)="onSearchApplied($event)"
          ></sky-select-field>
        ${backtick},
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    tree.create(
      'src/app/test.module.ts',
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkySelectFieldModule } from '@skyux/select-field';
      import { TestComponent } from './test.component';

      @NgModule({
        declarations: [TestComponent],
        imports: [SkySelectFieldModule, NgModel],
        exports: [TestComponent],
      })
      export class TestModule {}
    `,
    );
    const output = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        standalone: false,
        template: ${backtick}
          <sky-lookup
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data | async"
            [descriptorProperty]="descriptorKey"
            [disabled]="disabled"
            [selectMode]="selectMode"
            placeholderText="Placeholder Text"
            [showMoreConfig]="{ nativePickerConfig: { title: 'Picker Heading' } }"
            [showAddButton]="true"
            [(ngModel)]="formData.modelValue"
            (ngModelChange)="onModelChange($event)"
            (addClick)="onAddNewRecordButtonClick()"
            idProperty="id"></sky-lookup>
        ${backtick},
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup('', {
          bestEffortMode: true,
          insertTodos: true,
          projectPath: '',
        }),
        tree,
      ),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
    expect(
      stripIndents`${tree.readText('src/app/test.module.ts')}`,
    ).toMatchSnapshot();
  });

  it('should throw error for impossible conversion', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      standalone: true,
      flat: true,
    });
    const input = stripIndents`
      <sky-select-field [pickerHeading]="pickerHeading" (blur)="onBlur()" />
    `;
    tree.overwrite('src/app/test.component.html', input);
    await expect(() =>
      firstValueFrom(
        runner.callRule(
          convertSelectFieldToLookup('', {
            bestEffortMode: false,
            insertTodos: true,
            projectPath: '',
          }),
          tree,
        ),
      ),
    ).rejects.toThrowError(
      'The "blur" event is not supported on the <sky-lookup> component. The \'bestEffortMode\' option is required to continue.',
    );
    // The input should not be modified.
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      input,
    );
  });

  it('should throw an error if it cannot find a module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        standalone: false,
        template: ${backtick}
          <sky-select-field
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data"
            [descriptorKey]="descriptorKey"
            [disabled]="disabled"
            [inMemorySearchEnabled]="inMemorySearchEnabled"
            [multipleSelectOpenButtonText]="multipleSelectOpenButtonText"
            [selectMode]="selectMode"
            [singleSelectClearButtonTitle]="singleSelectClearButtonTitle"
            [singleSelectOpenButtonTitle]="singleSelectOpenButtonTitle"
            singleSelectPlaceholderText="Placeholder Text"
            pickerHeading="Picker Heading"
            [showAddNewRecordButton]="true"
            [(ngModel)]="formData.modelValue"
            (blur)="onBlur)"
            (ngModelChange)="onModelChange($event)"
            (addNewRecordButtonClick)="onAddNewRecordButtonClick()"
            (searchApplied)="onSearchApplied($event)"
          ></sky-select-field>
        ${backtick},
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        standalone: false,
        template: ${backtick}
          <sky-lookup
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="data | async"
            [descriptorProperty]="descriptorKey"
            [disabled]="disabled"
            [selectMode]="selectMode"
            placeholderText="Placeholder Text"
            [showMoreConfig]="{ nativePickerConfig: { title: 'Picker Heading' } }"
            [showAddButton]="true"
            [(ngModel)]="formData.modelValue"
            (ngModelChange)="onModelChange($event)"
            (addClick)="onAddNewRecordButtonClick()"
            idProperty="id"></sky-lookup>
        ${backtick},
      })
      export class TestComponent {}
    `;
    const context: Pick<SchematicContext, 'logger'> = {
      logger: new logging.NullLogger(),
    };
    const warn = jest.spyOn(context.logger, 'warn');
    convertSelectFieldToLookup('', {
      bestEffortMode: true,
      insertTodos: true,
      projectPath: '',
    })(tree, context as SchematicContext);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
    expect(warn).toHaveBeenCalledWith(
      'Could not find the declaring module for the component in /src/app/test.component.ts. Please review the code to ensure it still works as expected.',
    );
  });
});
