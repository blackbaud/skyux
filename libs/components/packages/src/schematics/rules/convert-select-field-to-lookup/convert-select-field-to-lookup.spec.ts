import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { parseSourceFile } from '@angular/cdk/schematics';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';

import { firstValueFrom } from 'rxjs';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from '../../testing/angular-module-generator';
import { createTestApp } from '../../testing/scaffold';
import * as logOnce from '../../utility/log-once';
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
    tree.overwrite(
      'src/app/test.component.ts',
      stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        standalone: false,
        templateUrl: './test.component.html',
        styleUrl: './test.component.scss'
      })
      export class TestComponent {
        public formData = {
          modelValue: null,
        };
        public ariaLabel = 'Aria Label';
        public ariaLabelledBy = 'Aria Labelled By';
        public customPicker = false;
        public data = [];
        public descriptorKey = 'label';
        public disabled = false;
        public inMemorySearchEnabled = true;
        public multipleSelectOpenButtonText = 'Open Multiple Select';
        public selectMode = 'single';
        public singleSelectClearButtonTitle = 'Clear Selection';
        public singleSelectOpenButtonTitle = 'Open Single Select';
        public singleSelectPlaceholderText = 'Select an option';
        public pickerHeading = 'Picker Heading';

        onBlur() {}
        onModelChange(value: any) {}
        onSearchApplied(value: any) {}
      }
    `,
    );
    tree.overwrite(
      'src/app/test.component.spec.ts',
      stripIndents`
      import { TestBed } from '@angular/core/testing';
      import { SkySelectFieldModule } from '@skyux/select-field';

      import { TestComponent } from './test.component';

      describe('Test component', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [SkySelectFieldModule],
          });
        });

        it('should create a test component', () => {
          const fixture = TestBed.createComponent(TestComponent);
          fixture.detectChanges();
          expect(fixture.component).toBeTruthy();
        });
      });
    `,
    );
    const output = stripIndents`
      <sky-lookup
        *ngIf="true"
        name="modelValue"
        [ariaLabel]="ariaLabel"
        [ariaLabelledBy]="ariaLabelledBy"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="(data | async) ?? []"
        [descriptorProperty]="descriptorKey"
        [disabled]="disabled"
        [selectMode]="selectMode"
        [placeholderText]="singleSelectPlaceholderText"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        enableShowMore
        idProperty="id" />
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
    expect(
      stripIndents`${tree.readText('src/app/test.component.spec.ts')}`,
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
    applyChangesToFile(
      tree,
      'src/app/test.component.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.component.ts'),
        'Component',
        'src/app/test.component.ts',
        'imports',
        'SkySelectFieldModule',
        '@skyux/select-field',
      ),
    );
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
        selectMode="single"
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
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        selectMode="single"
        placeholderText="{{ singleSelectPlaceholderText }}"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
    `;
    const logOnceSpy = jest
      .spyOn(logOnce, 'logOnce')
      .mockImplementation(() => {});
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
    expect(logOnceSpy).toHaveBeenCalledWith(
      expect.any(Object),
      'warn',
      'The <sky-select-field> component would return a single item when using single select mode, but the <sky-lookup> component returns an array value regardless of the "selectMode" attribute. The form model and validation may need to be updated. Please review the code to ensure it still works as expected.',
    );
    expect(
      stripIndents`${tree.readText('src/app/test.component.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert select field to use input box with label text', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      standalone: true,
      flat: true,
    });
    applyChangesToFile(
      tree,
      'src/app/test.component.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.component.ts'),
        'Component',
        'src/app/test.component.ts',
        'imports',
        'SkySelectFieldModule',
        '@skyux/select-field',
      ),
    );
    const input = stripIndents`
      <div>
      <label for="modelValue">Model Value</label>
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
      </div>
    `;
    tree.overwrite('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-input-box labelText="Model Value">
      <sky-lookup
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        [selectMode]="selectMode"
        placeholderText="{{ singleSelectPlaceholderText }}"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
      </sky-input-box>
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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

  it('should convert select field to use input box with label text, leaving the parent', async () => {
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
      <app-cmp>
      <label for="modelValue">
        {{ 'resource' | skyAppResources }}
      </label>
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
      </app-cmp>
    `;
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
      <app-cmp>
      <sky-input-box labelText="{{ 'resource' | skyAppResources }}">
      <sky-lookup
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        [selectMode]="selectMode"
        placeholderText="{{ singleSelectPlaceholderText }}"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
      </sky-input-box></app-cmp>
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
      stripIndents`${tree.readText('src/app/test.module.ts')}`,
    ).toMatchSnapshot();
  });

  it('should convert select field without input box if the label is too complicated', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test-app',
      module: 'test',
      flat: true,
    });
    const backtick = '`';
    const input = stripIndents`
      <app-cmp>
      <label for="modelValue">
        Can't {{ 'resource' | skyAppResources }}
        {{ "resource" | skyAppResources }}
        {{ ${backtick}resource${backtick} | skyAppResources }} touch this
      </label>
      <sky-select-field
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [customPicker]="customPicker"
        [data]="data"
        [disabled]="disabled"
      />
      </app-cmp>
      <app-cmp>
      <label for="modelValue">
        Can {{ 'resource' | skyAppResources }}
        {{ "resource" | skyAppResources }} touch this
      </label>
      <sky-select-field
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [customPicker]="customPicker"
        [data]="data"
        [disabled]="disabled"
      />
      </app-cmp>
      <app-cmp>
      <label for="modelValue">
        {{ "Can touch this" | skyAppResources }}
      </label>
      <sky-select-field
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [data]="data"
        [disabled]="disabled"
      />
      </app-cmp>
    `;
    applyChangesToFile(
      tree,
      'src/app/test.component.ts',
      addSymbolToClassMetadata(
        parseSourceFile(tree, 'src/app/test.component.ts'),
        'Component',
        'src/app/test.component.ts',
        'imports',
        'SkySelectFieldModule',
        '@skyux/select-field',
      ),
    );
    tree.overwrite('src/app/test.component.html', input);
    const output = stripIndents`
      <app-cmp>
      <label for="modelValue">
        Can't {{ 'resource' | skyAppResources }}
        {{ "resource" | skyAppResources }}
        {{ ${backtick}resource${backtick} | skyAppResources }} touch this
      </label>
      <sky-lookup
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ customPicker: customPicker }"
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
      </app-cmp>
      <app-cmp>
      <sky-input-box labelText="Can {{ 'resource' | skyAppResources }}
        {{ ${backtick}resource${backtick} | skyAppResources }} touch this">
      <sky-lookup
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ customPicker: customPicker }"
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
      </sky-input-box></app-cmp>
      <app-cmp>
      <sky-input-box labelText='{{ "Can touch this" | skyAppResources }}'>
      <sky-lookup
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [data]="(data | async) ?? []"
        [disabled]="disabled"
        descriptorProperty="label"
        enableShowMore
        idProperty="id" />
      </sky-input-box></app-cmp>
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
        convertSelectFieldToLookup({
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

      import { SkyInputBoxModule } from '@skyux/forms';
      import { AsyncPipe } from '@angular/common';
      import { SkyLookupModule } from '@skyux/lookup';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-lookup
            name="modelValue"
            ariaLabel="ariaLabel"
            ariaLabelledBy="ariaLabelledBy"
            [data]="(data | async) ?? []"
            [descriptorProperty]="descriptorKey"
            [disabled]="disabled"
            [selectMode]="selectMode"
            placeholderText="Placeholder Text"
            [showMoreConfig]="{ nativePickerConfig: { title: 'Picker Heading' } }"
            [showAddButton]="true"
            [(ngModel)]="formData.modelValue"
            (ngModelChange)="onModelChange($event)"
            (addClick)="onAddNewRecordButtonClick()"
            enableShowMore
            idProperty="id"></sky-lookup>
        ${backtick},
        imports: [SkyLookupModule, SkyInputBoxModule, AsyncPipe],
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
            [data]="(data | async) ?? []"
            [descriptorProperty]="descriptorKey"
            [disabled]="disabled"
            [selectMode]="selectMode"
            placeholderText="Placeholder Text"
            [showMoreConfig]="{ nativePickerConfig: { title: 'Picker Heading' } }"
            [showAddButton]="true"
            [(ngModel)]="formData.modelValue"
            (ngModelChange)="onModelChange($event)"
            (addClick)="onAddNewRecordButtonClick()"
            enableShowMore
            idProperty="id"></sky-lookup>
        ${backtick},
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(
        convertSelectFieldToLookup({
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
          convertSelectFieldToLookup({
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
});
