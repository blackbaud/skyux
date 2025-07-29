import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

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
    tree.create('src/app/test.component.html', input);
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
        (ngModelChange)="onModelChange($event)" />
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
  });

  it('should convert select field to lookup using template expressions', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-select-field
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [customPicker]="customPicker"
        [data]="data"
        descriptorKey="{{ descriptorKey }}"
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
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-lookup
        name="modelValue"
        ariaLabel="{{ ariaLabel }}"
        ariaLabelledBy="{{ ariaLabelledBy }}"
        [showMoreConfig]="{ nativePickerConfig: { title: ( pickerHeading ) }, customPicker: customPicker }"
        [data]="data | async"
        descriptorProperty="{{ descriptorKey }}"
        [disabled]="disabled"
        [selectMode]="selectMode"
        placeholderText="{{ singleSelectPlaceholderText }}"
        [(ngModel)]="formData.modelValue"
        (ngModelChange)="onModelChange($event)" />
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
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create('src/app/test.component.html', '<sky-select-field');
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
            (addClick)="onAddNewRecordButtonClick()"></sky-lookup>
        ${backtick},
        imports: [SkyLookupModule],
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

  it('should throw error for impossible conversion', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-select-field [data]="data" [pickerHeading]="pickerHeading" (blur)="onBlur()" />
    `;
    tree.create('src/app/test.component.html', input);
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
});
