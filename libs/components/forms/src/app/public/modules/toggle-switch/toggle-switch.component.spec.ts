import {
  DebugElement
} from '@angular/core';

import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  FormControl,
  NgModel
} from '@angular/forms';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyToggleSwitchChangeEventFixtureComponent
} from './fixtures/toggle-switch-change-event.component.fixture';

import {
  SkyToggleSwitchFixtureComponent
} from './fixtures/toggle-switch.component.fixture';

import {
  SkyToggleSwitchFixturesModule
} from './fixtures/toggle-switch.module.fixture';

import {
  SkyToggleSwitchFormDirectivesFixtureComponent
} from './fixtures/toggle-switch-form-directives.component.fixture';

import {
  SkyToggleSwitchOnPushFixtureComponent
} from './fixtures/toggle-switch-on-push.component.fixture';

import {
  SkyToggleSwitchReactiveFormFixtureComponent
} from './fixtures/toggle-switch-reactive-form.component.fixture';

import {
  SkyToggleSwitchComponent
} from './toggle-switch.component';

describe('Toggle switch component', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyToggleSwitchFixturesModule
      ]
    });
  });

  describe('basic behaviors', () => {
    let toggleDebugElement: DebugElement;
    let toggleNativeElement: HTMLElement;
    let toggleInstance: SkyToggleSwitchComponent;
    let testComponent: SkyToggleSwitchFixtureComponent;
    let buttonElement: HTMLButtonElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleDebugElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleDebugElement.nativeElement;
      toggleInstance = toggleDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      buttonElement = toggleNativeElement.querySelector('button');
    }));

    it('should add and remove the checked state', () => {
      expect(toggleInstance.checked).toEqual(false);
      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(true);
      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);
    });

    it('should toggle `checked` state on click', fakeAsync(() => {
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);

      buttonElement.click();

      tick();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(true);
      expect(testComponent.isChecked).toEqual(true);

      buttonElement.click();

      tick();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);
    }));

    it('should add and remove disabled state', () => {
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(false);
      expect(buttonElement.tabIndex).toEqual(0);
      expect(buttonElement.disabled).toEqual(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(true);
      expect(buttonElement.disabled).toEqual(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(false);
      expect(buttonElement.tabIndex).toEqual(0);
      expect(buttonElement.disabled).toEqual(false);
    });

    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonElement.click();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);

      buttonElement.click();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
    });

    it('should project the toggle content into the label element', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const label = toggleNativeElement.querySelector('.sky-toggle-switch-label');

      expect(label.textContent.trim()).toEqual('Simple toggle');
    }));

    it('should make the host element a tab stop', () => {
      expect(buttonElement.tabIndex).toEqual(0);
    });

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

  });

  describe('with change event and no initial value', () => {
    let toggleDebugElement: DebugElement;
    let toggleNativeElement: HTMLElement;
    let toggleInstance: SkyToggleSwitchComponent;
    let testComponent: SkyToggleSwitchChangeEventFixtureComponent;
    let buttonElement: HTMLButtonElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchChangeEventFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleDebugElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleDebugElement.nativeElement;
      toggleInstance = toggleDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');
    }));

    it('should call not call the change event when the toggle is not interacted with',
      fakeAsync(() => {
        fixture.detectChanges();
        expect(testComponent.lastEvent).toBeUndefined();

        toggleInstance.checked = true;
        fixture.detectChanges();

        tick();
        expect(testComponent.lastEvent).toBeUndefined();
      }));

    it('should call the change event and not emit a DOM event to the change output', fakeAsync(() => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      // Trigger the click on the buttonElement, because the input will probably
      // emit a DOM event to the change output.
      buttonElement.click();
      fixture.detectChanges();

      tick();
      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent.checked).toEqual(true);

    }));
  });

  describe('with provided ariaLabel attribute ', () => {
    let toggleDebugElement: DebugElement;
    let toggleNativeElement: HTMLElement;
    let buttonElement: HTMLButtonElement;

    it('should use the provided ariaLabel as the input aria-label', fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      toggleDebugElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleDebugElement.nativeElement;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');

      fixture.detectChanges();

      tick();
      expect(buttonElement.getAttribute('aria-label')).toEqual('Super effective');
    }));
  });

  describe('with provided tabIndex', () => {
    let toggleDebugElement: DebugElement;
    let toggleNativeElement: HTMLElement;
    let testComponent: SkyToggleSwitchFixtureComponent;
    let buttonElement: HTMLButtonElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      fixture.detectChanges();
      tick();

      testComponent = fixture.debugElement.componentInstance;
      toggleDebugElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleDebugElement.nativeElement;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');

      testComponent.customTabIndex = 7;
      fixture.detectChanges();
    }));

    it('should preserve any given tabIndex', () => {
      expect(buttonElement.tabIndex).toEqual(7);
    });

    it('should preserve given tabIndex when the toggle is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(buttonElement.tabIndex).toEqual(13);
    });
  });

  describe('with multiple toggles', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);
      fixture.debugElement.componentInstance.multiple = true;
      fixture.detectChanges();
    });
  });

  describe('with ngModel and an initial value', () => {
    let toggleElement: DebugElement;
    let testComponent: SkyToggleSwitchFormDirectivesFixtureComponent;
    let buttonElement: HTMLButtonElement;
    let toggleNativeElement: HTMLElement;
    let ngModel: NgModel;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFormDirectivesFixtureComponent);
      testComponent = fixture.debugElement.componentInstance;
      testComponent.modelValue = true;

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleElement.nativeElement;

      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');
      ngModel = <NgModel>toggleElement.injector.get(NgModel);
    }));

    it('should be in pristine, untouched, and valid states', fakeAsync(() => {
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(true);
      expect(ngModel.dirty).toEqual(false);
      expect(ngModel.touched).toEqual(false);
      expect(testComponent.modelValue).toEqual(true);

      buttonElement.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(false);
      expect(ngModel.dirty).toEqual(true);
      expect(ngModel.touched).toEqual(false);
      expect(testComponent.modelValue).toEqual(false);

      SkyAppTestUtility.fireDomEvent(buttonElement, 'blur');

      expect(ngModel.touched).toEqual(true);
    }));
  });

  describe('with ngModel', () => {
    let toggleElement: DebugElement;
    let testComponent: SkyToggleSwitchFormDirectivesFixtureComponent;
    let buttonElement: HTMLButtonElement;
    let toggleNativeElement: HTMLElement;
    let ngModel: NgModel;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFormDirectivesFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');
      ngModel = <NgModel>toggleElement.injector.get(NgModel);
    }));

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(true);
      expect(ngModel.dirty).toEqual(false);
      expect(ngModel.touched).toEqual(false);

      buttonElement.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(false);
      expect(ngModel.dirty).toEqual(true);
      expect(ngModel.touched).toEqual(false);
      expect(testComponent.modelValue).toEqual(true);

      SkyAppTestUtility.fireDomEvent(buttonElement, 'blur');

      expect(ngModel.touched).toEqual(true);
    }));

    it('should change toggle state through ngModel programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);
      expect(testComponent.modelValue).toEqual(false);

      fixture.detectChanges();

      testComponent.modelValue = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(true);
    }));
  });

  describe('with reactive form', () => {
    let toggleElement: DebugElement;
    let testComponent: SkyToggleSwitchReactiveFormFixtureComponent;
    let buttonElement: HTMLButtonElement;
    let toggleNativeElement: HTMLElement;
    let formControl: FormControl;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchReactiveFormFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');
      formControl = testComponent.toggle1;
    }));

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();

      expect(formControl.valid).toEqual(true);
      expect(formControl.pristine).toEqual(true);
      expect(formControl.dirty).toEqual(false);
      expect(formControl.touched).toEqual(false);

      buttonElement.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(formControl.valid).toEqual(true);
      expect(formControl.pristine).toEqual(false);
      expect(formControl.touched).toEqual(false);
      expect(formControl.dirty).toEqual(true);
      expect(formControl.value).toEqual(true);

      SkyAppTestUtility.fireDomEvent(buttonElement, 'blur');

      expect(formControl.touched).toEqual(true);
    }));

    it('should change toggle state through form control programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);
      expect(formControl.value).toEqual(false);

      fixture.detectChanges();

      formControl.setValue(true);

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(true);
    }));

    it('should change disable state through form control programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(buttonElement.disabled).toEqual(false);
      expect(formControl.value).toEqual(false);

      fixture.detectChanges();

      formControl.disable();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement.disabled).toEqual(true);
      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);

      formControl.enable();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement.disabled).toEqual(false);
      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);
    }));
  });

  describe('with a consumer using OnPush change detection', () => {
    let toggleElement: DebugElement;
    let testComponent: SkyToggleSwitchOnPushFixtureComponent;
    let buttonElement: HTMLButtonElement;
    let toggleNativeElement: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchOnPushFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(By.directive(SkyToggleSwitchComponent));
      toggleNativeElement = toggleElement.nativeElement;

      testComponent = fixture.debugElement.componentInstance;
      buttonElement = <HTMLButtonElement>toggleNativeElement.querySelector('button');
    }));

    it('should change toggle state through ngModel programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);

      fixture.detectChanges();

      testComponent.isChecked = true;
      testComponent.ref.markForCheck();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement.classList.contains('sky-toggle-switch-checked')).toEqual(true);
    }));

    it('should only use ARIA labelledby if label component exists', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      const labelledBy = buttonElement.getAttribute('aria-labelledby');

      expect(labelledBy.indexOf('sky-toggle-switch-label-')).toEqual(0);

      testComponent.showLabel = false;
      testComponent.ref.markForCheck();

      tick();
      fixture.detectChanges();

      expect(buttonElement.getAttribute('aria-labelledby')).toBeFalsy();
    }));
  });
});
