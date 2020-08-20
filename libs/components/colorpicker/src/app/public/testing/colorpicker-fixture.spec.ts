import {
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyColorpickerModule
} from '@skyux/colorpicker';

import {
  SkyColorpickerFixture
} from './colorpicker-fixture';

@Component({
  selector: 'colorpicker-test',
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
`
})
class TestComponent {
  public hexColor = '#000';
  public outputFormat = 'hex';
  public presetColors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];
  public selectedColor = this.hexColor;

  public onColorChanged = () => {};
  public onColorApplied = () => {};
}

describe('Colorpicker fixture', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        FormsModule,
        SkyColorpickerModule
      ]
    });
  });

  it('should expose the input value', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(
      fixture,
      'test-colorpicker'
    );

    await fixture.whenStable();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);
  });

  it('should set the colorpicker hex value', async () => {
    const newColor = '#fff';
    const fixture = TestBed.createComponent(
      TestComponent
    );

    spyOn(fixture.componentInstance, 'onColorChanged');
    spyOn(fixture.componentInstance, 'onColorApplied');

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(
      fixture,
      'test-colorpicker'
    );

    await fixture.whenStable();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromHex(newColor);

    expect(colorpicker.value).toEqual(newColor);
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it('should set the colorpicker rgb value', async () => {
    const currentColor = 'rgba(0,0,0,1)';
    const newColor = 'rgba(25,25,25,1)';
    const fixture = TestBed.createComponent(
      TestComponent
    );

    spyOn(fixture.componentInstance, 'onColorChanged');
    spyOn(fixture.componentInstance, 'onColorApplied');

    fixture.componentInstance.selectedColor = currentColor;
    fixture.componentInstance.outputFormat = 'rgba';

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(
      fixture,
      'test-colorpicker'
    );

    await fixture.whenStable();
    expect(colorpicker.value).toEqual(currentColor);

    await colorpicker.setValueFromRGBA(25, 25, 25, 1);

    expect(colorpicker.value).toEqual(newColor);
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it ('should select a color from the given index of the preset list if that color exists', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    spyOn(fixture.componentInstance, 'onColorChanged');
    spyOn(fixture.componentInstance, 'onColorApplied');

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(
      fixture,
      'test-colorpicker'
    );

    await fixture.whenStable();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromPresets(3);

    expect(colorpicker.value).toEqual(fixture.componentInstance.presetColors[3]);
    expect(fixture.componentInstance.onColorChanged).toHaveBeenCalled();
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });

  it ('should select a new color from the given index of the preset list if that color does not exist', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    spyOn(fixture.componentInstance, 'onColorChanged');
    spyOn(fixture.componentInstance, 'onColorApplied');

    fixture.detectChanges();

    const colorpicker = new SkyColorpickerFixture(
      fixture,
      'test-colorpicker'
    );

    await fixture.whenStable();
    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);

    await colorpicker.setValueFromPresets(6);

    expect(colorpicker.value).toEqual(fixture.componentInstance.hexColor);
    expect(fixture.componentInstance.onColorApplied).toHaveBeenCalled();
  });
});
