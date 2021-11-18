import { TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';

import { SkyCheckboxModule } from 'projects/forms/src/public-api';

import { SkyCheckboxFixture } from './checkbox-fixture';

//#region Test component
@Component({
  selector: 'sky-checkbox-test',
  template: `
    <sky-checkbox
      [checkboxType]="checkboxType"
      [checked]="selected"
      [disabled]="disabled"
      [icon]="icon"
      [id]="id"
      [label]="label"
      [labelledBy]="labelledBy"
      [name]="name"
      data-sky-id="test-checkbox"
    >
      <sky-checkbox-label id="checkbox-label">
        {{ label }}
      </sky-checkbox-label>
    </sky-checkbox>
  `,
})
class TestComponent {
  public checkboxType = 'success';

  public disabled = false;

  public icon = 'star';

  public label = 'checkbox label';

  public labelledBy = 'checkbox-label';

  public selected = false;
}
//#endregion Test component

describe('Checkbox fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyCheckboxModule],
    });
  });

  it('should expose the provided properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const checkbox = new SkyCheckboxFixture(fixture, 'test-checkbox');

    expect(checkbox.selected).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(checkbox.labelText).toEqual(fixture.componentInstance.label);
    expect(checkbox.iconType).toEqual(fixture.componentInstance.icon);
    expect(checkbox.checkboxType).toEqual(
      fixture.componentInstance.checkboxType
    );

    const validCheckboxTypes = ['info', 'success', 'warning', 'danger'];

    for (const validCheckboxType of validCheckboxTypes) {
      fixture.componentInstance.checkboxType = validCheckboxType;

      fixture.detectChanges();

      expect(checkbox.checkboxType).toBe(validCheckboxType);
    }

    fixture.componentInstance.checkboxType = 'invalid';

    fixture.detectChanges();

    expect(checkbox.checkboxType).toBeUndefined();
  });

  it('should provide a method for selecting the checkbox', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toBe(false);

    const checkbox = new SkyCheckboxFixture(fixture, 'test-checkbox');

    checkbox.select();
    expect(checkbox.selected).toBe(true);

    checkbox.select();
    expect(checkbox.selected).toBe(true);

    checkbox.deselect();
    expect(checkbox.selected).toBe(false);

    checkbox.deselect();
    expect(checkbox.selected).toBe(false);
  });
});
