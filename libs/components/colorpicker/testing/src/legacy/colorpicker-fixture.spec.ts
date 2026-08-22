import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { expect } from '@skyux-sdk/testing';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyThemeService } from '@skyux/theme';

import { SkyColorpickerFixture } from './colorpicker-fixture';

@Component({
  selector: 'sky-colorpicker-test',
  template: `
    <div>
      <sky-colorpicker
        data-sky-id="test-colorpicker"
        (selectedColorChanged)="onColorChanged()"
        (selectedColorApplied)="onColorApplied()"
        #colorpickerTest
      >
        <input
          type="text"
          [outputFormat]="outputFormat"
          [presetColors]="presetColors"
          [skyColorpickerInput]="colorpickerTest"
          [(ngModel)]="selectedColor"
        />
      </sky-colorpicker>
    </div>
  `,
  standalone: false,
})
class TestComponent {
  public hexColor = '#000';
  public outputFormat = 'hex';
  public presetColors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];
  public selectedColor = this.hexColor;

  public onColorChanged = jasmine.createSpy('onColorChanged');
  public onColorApplied = jasmine.createSpy('onColorApplied');
}

describe('Colorpicker fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, SkyColorpickerModule],
      providers: [SkyThemeService],
    });
  });

  it('should expose the input value', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(fixture, 'test-colorpicker');

    // NgModel defers its initial write to the bound control via a
    // resolved-promise microtask (see `NgModel._updateValue` in
    // `@angular/forms`), so an extra change-detection pass is needed
    // after `whenStable()` to flush that write into the rendered value.
    await fixture.whenStable();
    fixture.detectChanges();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);
  });

  it('should set the colorpicker hex value', async () => {
    const newColor = '#fff';
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(fixture, 'test-colorpicker');

    await fixture.whenStable();
    fixture.detectChanges();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromHex(newColor);

    expect(colorpicker.value).toEqual(newColor);
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it('should set the colorpicker rgb value', async () => {
    const currentColor = 'rgba(0,0,0,1)';
    const newColor = 'rgba(25,25,25,1)';
    const fixture = TestBed.createComponent(TestComponent);

    fixture.componentInstance.selectedColor = currentColor;
    fixture.componentInstance.outputFormat = 'rgba';

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(fixture, 'test-colorpicker');

    await fixture.whenStable();
    fixture.detectChanges();
    expect(colorpicker.value).toEqual(currentColor);

    await colorpicker.setValueFromRGBA(25, 25, 25, 1);

    expect(colorpicker.value).toEqual(newColor);
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it('should select a color from the given index of the preset list if that color exists', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(fixture, 'test-colorpicker');

    await fixture.whenStable();
    fixture.detectChanges();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromPresets(3);

    expect(colorpicker.value).toEqual(
      fixture.componentInstance.presetColors[3],
    );
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it('should select a new color from the given index of the preset list if that color does not exist', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(fixture, 'test-colorpicker');

    await fixture.whenStable();
    fixture.detectChanges();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromPresets(6);

    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });
});
