// #region imports
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  async
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyRadioFixturesModule,
  SkyRadioGroupBooleanTestComponent,
  SkyRadioGroupTestComponent
} from './fixtures';
// #endregion

describe('Radio group component', function () {
  let fixture: ComponentFixture<SkyRadioGroupTestComponent>;
  let componentInstance: SkyRadioGroupTestComponent;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        SkyRadioFixturesModule
      ]
    });

    fixture = TestBed.createComponent(SkyRadioGroupTestComponent);
    componentInstance = fixture.componentInstance;
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should update the ngModel properly when radio button is changed', fakeAsync(function () {
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('input');
    radios.item(1).click();
    fixture.detectChanges();
    tick();

    const value = componentInstance.radioForm.value.option;

    expect(radios.item(1).checked).toBe(true);
    expect(value.name).toEqual('Harima Kenji');
    expect(componentInstance.radioGroupComponent.value).toEqual(value);
  }));

  it('should update the radio buttons properly when ngModel is changed', fakeAsync(function () {
    fixture.detectChanges();
    expect(componentInstance.radioGroupComponent.value.name).toEqual('Lillith Corharvest');

    componentInstance.radioForm.patchValue({
      option: componentInstance.options[1]
    });
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioGroupComponent.value.name).toEqual('Harima Kenji');
  }));

  it('should handle disabled state properly', fakeAsync(function (done: Function) {
    componentInstance.options[1].disabled = true;
    fixture.detectChanges();
    tick();

    const radios = fixture.nativeElement.querySelectorAll('input');
    radios.item(1).click();
    fixture.detectChanges();
    tick();

    expect(radios.item(1).checked).toBe(false);
    expect(componentInstance.radioForm.value.option.name).toBe('Lillith Corharvest');

    componentInstance.options[1].disabled = false;
    fixture.detectChanges();
    tick();

    radios.item(1).click();
    fixture.detectChanges();
    tick();

    expect(radios.item(1).checked).toBe(true);
    expect(componentInstance.radioForm.value.option.name).toBe('Harima Kenji');
  }));

  it('should use tabIndex when specified', fakeAsync(function () {
    componentInstance.tabIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('input');
    for (let element of radios) {
      expect(element.getAttribute('tabindex')).toBe('2');
    }
  }));

  it('should maintain tabIndex when options change', fakeAsync(function () {
    componentInstance.tabIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    componentInstance.changeOptions();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('input');
    for (let element of radios) {
      expect(element.getAttribute('tabindex')).toBe('2');
    }
  }));

  it('should set the radio name properties correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const radios = fixture.nativeElement.querySelectorAll('input');
    for (let element of radios) {
      expect(element.getAttribute('name')).toBe('option');
    }
  }));

  it('should set the radio name properties correctly when options change', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    componentInstance.changeOptions();
    fixture.detectChanges();
    tick();

    const radios = fixture.nativeElement.querySelectorAll('input');
    for (let element of radios) {
      expect(element.getAttribute('name')).toBe('option');
    }
  }));

  it('should maintain checked state when value is changed', fakeAsync(function () {
    fixture.detectChanges();

    let newValue = {
      name: 'Jerry Salmonella',
      disabled: false
    };

    let radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();

    newValue = {
      name: 'Sarah Jellyman',
      disabled: false
    };

    radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();
  }));

  it('should maintain checked state when options are changed', fakeAsync(function () {
    fixture.detectChanges();

    let newValue = {
      name: 'Jerry Salmonella',
      disabled: false
    };

    let radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();

    componentInstance.changeOptions();

    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();
  }));

  it('should set the aria-labeledby property correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const radioGroupDiv = fixture.nativeElement.querySelector('.sky-radio-group');
    expect(radioGroupDiv.getAttribute('aria-labelledby')).toBe('radio-group-label');
  }));

  it('should set the aria-label property correctly', fakeAsync(() => {
    componentInstance.ariaLabel = 'radio-group-label-manual';
    componentInstance.ariaLabelledBy = undefined;

    fixture.detectChanges();
    tick();

    const radioGroupDiv = fixture.nativeElement.querySelector('.sky-radio-group');
    expect(radioGroupDiv.getAttribute('aria-label')).toBe('radio-group-label-manual');
  }));

  it('should support boolean values', fakeAsync(function () {
    const booleanFixture = TestBed.createComponent(SkyRadioGroupBooleanTestComponent);
    const booleanComponent = booleanFixture.componentInstance;

    booleanFixture.detectChanges();
    tick();

    const radios = booleanFixture.nativeElement.querySelectorAll('.sky-radio-input');

    expect(booleanComponent.radioGroupComponent.value).toEqual(false);
    expect(radios.item(0).checked).toEqual(true);
    expect(radios.item(1).checked).toEqual(false);

    radios.item(1).click();
    booleanFixture.detectChanges();
    tick();

    expect(booleanComponent.radioGroupComponent.value).toEqual(true);
    expect(booleanComponent.radioForm.get('booleanValue').value).toEqual(true);
    expect(radios.item(0).checked).toEqual(false);
    expect(radios.item(1).checked).toEqual(true);

    radios.item(0).click();
    booleanFixture.detectChanges();
    tick();

    expect(booleanComponent.radioGroupComponent.value).toEqual(false);
    expect(booleanComponent.radioForm.get('booleanValue').value).toEqual(false);
    expect(radios.item(0).checked).toEqual(true);
    expect(radios.item(1).checked).toEqual(false);
  }));

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
