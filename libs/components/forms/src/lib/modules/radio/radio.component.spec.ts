import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { SkyRadioFixturesModule } from './fixtures/radio-fixtures.module';
import { SkyRadioOnPushTestComponent } from './fixtures/radio-on-push.component.fixture';
import { SkySingleRadioComponent } from './fixtures/radio-single.component.fixture';
import { SkyRadioTestComponent } from './fixtures/radio.component.fixture';
import { SkyRadioLabelComponent } from './radio-label.component';
import { SkyRadioComponent } from './radio.component';

describe('Radio component', function () {
  let fixture: ComponentFixture<any>;
  let componentInstance: any;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [SkyRadioFixturesModule],
    });
  });

  afterEach(function () {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Standard radio component', () => {
    let testComponent: SkyRadioTestComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyRadioTestComponent);

      componentInstance = fixture.componentInstance;
      testComponent = fixture.debugElement.componentInstance;

      fixture.detectChanges();
      tick();
    }));

    it('should emit the new disabled value when it is modified', () => {
      const onDisabledChangeSpy = spyOn(testComponent, 'onDisabledChange');
      expect(onDisabledChangeSpy).toHaveBeenCalledTimes(0);
      testComponent.disabled1 = true;
      fixture.detectChanges();
      expect(onDisabledChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the ngModel properly when radio button is changed', fakeAsync(function () {
      const radioElement = fixture.debugElement.queryAll(
        By.directive(SkyRadioComponent)
      )[0];
      const ngModel = radioElement.injector.get(NgModel);
      const radios = fixture.nativeElement.querySelectorAll('input');

      radios.item(1).click();
      fixture.detectChanges();
      tick();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(true);
      expect(radios.item(0).checked).toBeFalsy();
      expect(radios.item(1).checked).toBeTruthy();
      expect(radios.item(2).checked).toBeFalsy();
      expect(componentInstance.selectedValue).toBe('2');

      SkyAppTestUtility.fireDomEvent(radios.item(1), 'blur');
      fixture.detectChanges();
      tick();

      expect(ngModel.touched).toBe(true);
    }));

    it('should register touch on blur', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      const radioElement = fixture.debugElement.queryAll(
        By.directive(SkyRadioComponent)
      )[0];
      const ngModel = radioElement.injector.get(NgModel);

      expect(ngModel.touched).toBe(false);

      const radios = fixture.nativeElement.querySelectorAll('input');
      SkyAppTestUtility.fireDomEvent(radios.item(1), 'blur');
      fixture.detectChanges();
      tick();

      expect(ngModel.touched).toBe(true);
    }));

    it('should update the radio buttons properly when ngModel is changed', fakeAsync(function () {
      fixture.detectChanges();
      componentInstance.selectedValue = '2';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(0).checked).toBeFalsy();
      expect(radios.item(1).checked).toBeTruthy();
      expect(radios.item(2).checked).toBeFalsy();
    }));

    it('should maintain checked state when value is changed', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      let radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(0).checked).toBeTruthy();

      fixture.componentInstance.value1 = 'abc';
      fixture.detectChanges();
      tick();

      radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(0).checked).toBeTruthy();
      expect(radios.item(1).checked).toBeFalsy();
      expect(radios.item(2).checked).toBeFalsy();
    }));

    it('should handle disabled state properly', fakeAsync(function () {
      const radios = fixture.nativeElement.querySelectorAll('input');
      radios.item(1).click();
      fixture.detectChanges();
      tick();

      componentInstance.disabled1 = true;
      fixture.detectChanges();
      tick();

      radios.item(0).click();
      fixture.detectChanges();
      tick();

      expect(radios.item(0).checked).toBeFalsy();
      expect(radios.item(1).checked).toBeTruthy();
      expect(radios.item(2).checked).toBeFalsy();
      expect(componentInstance.selectedValue).toBe('2');

      componentInstance.disabled1 = false;
      fixture.detectChanges();
      tick();

      radios.item(0).click();
      fixture.detectChanges();
      tick();

      expect(radios.item(0).checked).toBeTruthy();
      expect(radios.item(1).checked).toBeFalsy();
      expect(radios.item(2).checked).toBeFalsy();
      expect(componentInstance.selectedValue).toBe('1');
    }));

    it('should pass a label when specified', fakeAsync(function () {
      componentInstance.label1 = 'My label';
      fixture.detectChanges();
      tick();

      const radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(0).getAttribute('aria-label')).toBe('My label');
    }));

    it('should pass a labelled by id properly when specified', fakeAsync(function () {
      componentInstance.labelledBy3 = 'label-id';
      fixture.detectChanges();
      tick();

      const radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(2).getAttribute('aria-labelledby')).toBe('label-id');
    }));

    it('should use 0 when a tabindex is not specified', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      const radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(1).getAttribute('tabindex')).toBe('0');
    }));

    it('should pass a tabindex when specified', fakeAsync(function () {
      componentInstance.tabindex2 = '3';
      fixture.detectChanges();
      tick();

      const radios = fixture.nativeElement.querySelectorAll('input');
      expect(radios.item(1).getAttribute('tabindex')).toBe('3');
    }));

    it('should not change the selected value if input is disabled', fakeAsync(() => {
      const radioElement = fixture.debugElement.queryAll(
        By.directive(SkyRadioComponent)
      )[2];
      const radioComponent = radioElement.componentInstance;

      radioComponent.selectedValue = '1';
      radioComponent.disabled = true;
      radioComponent.onInputChange({ stopPropagation: () => {} });

      expect(radioComponent.selectedValue).toEqual('1');
    }));

    it('should not change the selected value if the new value is undefined', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const radioElement = fixture.debugElement.queryAll(
        By.directive(SkyRadioComponent)
      )[2];
      const radioComponent = radioElement.componentInstance;

      radioComponent.selectedValue = 'foo';
      radioComponent.writeValue(undefined);

      expect(radioComponent.selectedValue).toEqual('foo');
    }));

    it('should prevent click events on the label from bubbling to parents', fakeAsync(() => {
      const radioLabelElement = fixture.debugElement
        .query(By.css('#radio-clickable'))
        .query(By.directive(SkyRadioLabelComponent));

      spyOn(componentInstance, 'onClick');
      spyOn(radioLabelElement.componentInstance, 'onClick').and.callThrough();

      radioLabelElement.nativeElement.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect((componentInstance.onClick as any).calls.count()).toEqual(1);
      expect(radioLabelElement.componentInstance.onClick).toHaveBeenCalled();
    }));

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('Radio icon component', () => {
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkySingleRadioComponent);
      debugElement = fixture.debugElement;
    });

    it('should set icon based on input', () => {
      fixture.detectChanges();

      let radioIcon = debugElement.query(By.css('i')).nativeElement;
      expect(radioIcon).toHaveCssClass('fa-bold');

      fixture.componentInstance.icon = 'umbrella';
      fixture.detectChanges();

      radioIcon = debugElement.query(By.css('i')).nativeElement;
      expect(radioIcon).toHaveCssClass('fa-umbrella');
    });

    it('should set span class based on radio type input', () => {
      fixture.detectChanges();

      let span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-info');

      fixture.componentInstance.radioType = 'info';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-info');

      fixture.componentInstance.radioType = 'success';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-success');

      fixture.componentInstance.radioType = 'warning';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-warning');

      fixture.componentInstance.radioType = 'danger';
      fixture.detectChanges();

      span = debugElement.query(By.css('span')).nativeElement;
      expect(span).toHaveCssClass('sky-switch-control-danger');
    });

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('Radio component with a consumer using OnPush change detection', () => {
    beforeEach(function () {
      fixture = TestBed.createComponent(SkyRadioOnPushTestComponent);

      fixture.detectChanges();
      componentInstance = fixture.componentInstance;
    });

    it('should update the ngModel properly when radio button is changed', async(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const radios = fixture.nativeElement.querySelectorAll('input');

      expect(radios.item(0).checked).toBeTruthy();
      expect(radios.item(1).checked).toBeFalsy();
      expect(radios.item(2).checked).toBeFalsy();

      fixture.detectChanges();
      componentInstance.selectedValue = '2';
      componentInstance.ref.markForCheck();
      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(radios.item(0).checked).toBeFalsy();
      expect(radios.item(1).checked).toBeTruthy();
      expect(radios.item(2).checked).toBeFalsy();

      expect(componentInstance.selectedValue).toBe('2');
    }));
  });
});
