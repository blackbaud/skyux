import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NgModel, UntypedFormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyToggleSwitchChangeEventFixtureComponent } from './fixtures/toggle-switch-change-event.component.fixture';
import { SkyToggleSwitchFormDirectivesFixtureComponent } from './fixtures/toggle-switch-form-directives.component.fixture';
import { SkyToggleSwitchOnPushFixtureComponent } from './fixtures/toggle-switch-on-push.component.fixture';
import { SkyToggleSwitchReactiveFormFixtureComponent } from './fixtures/toggle-switch-reactive-form.component.fixture';
import { SkyToggleSwitchFixtureComponent } from './fixtures/toggle-switch.component.fixture';
import { SkyToggleSwitchFixturesModule } from './fixtures/toggle-switch.module.fixture';
import { SkyToggleSwitchComponent } from './toggle-switch.component';

describe('Toggle switch component', () => {
  function getButtonElement(
    fixture: ComponentFixture<unknown>,
  ): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-toggle-switch-button');
  }

  function getLabelElement(
    fixture: ComponentFixture<unknown>,
  ): HTMLLabelElement {
    return fixture.nativeElement.querySelector('label.sky-toggle-switch-label');
  }

  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyToggleSwitchFixturesModule, SkyHelpTestingModule],
    });
  });

  describe('basic behaviors', () => {
    let toggleDebugElement: DebugElement;
    let toggleNativeElement: HTMLElement;
    let toggleInstance: SkyToggleSwitchComponent;
    let testComponent: SkyToggleSwitchFixtureComponent;
    let buttonElement: HTMLButtonElement | null;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      fixture.detectChanges();
      tick();

      toggleDebugElement = fixture.debugElement.query(
        By.directive(SkyToggleSwitchComponent),
      );
      toggleNativeElement = toggleDebugElement.nativeElement;
      toggleInstance = toggleDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;

      buttonElement = getButtonElement(fixture);
    }));

    it('should add and remove the checked state', () => {
      expect(toggleInstance.checked).toEqual(false);
      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(true);
      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);
    });

    it('should toggle `checked` state on click', () => {
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);

      buttonElement?.click();

      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(true);
      expect(testComponent.isChecked).toEqual(true);

      buttonElement?.click();

      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);
    });

    it('should add and remove disabled state', () => {
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(false);
      expect(buttonElement?.tabIndex).toEqual(0);
      expect(buttonElement?.disabled).toEqual(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(true);
      expect(buttonElement?.disabled).toEqual(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(toggleInstance.disabled).toEqual(false);
      expect(buttonElement?.tabIndex).toEqual(0);
      expect(buttonElement?.disabled).toEqual(false);
    });

    it('should not toggle `checked` state upon interaction while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonElement?.click();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);

      buttonElement?.click();
      fixture.detectChanges();

      expect(toggleInstance.checked).toEqual(false);
    });

    it('should project the toggle content into the label element', () => {
      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent?.trim()).toEqual('Simple toggle');
    });

    it('should log a deprecation warning when aria label input is used', () => {
      const logService = TestBed.inject(SkyLogService);
      const spy = spyOn(logService, 'deprecated');

      testComponent.ariaLabel = 'aria label';
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('SkyToggleSwitchComponent.ariaLabel', {
        deprecationMajorVersion: 9,
        replacementRecommendation:
          'To add an ARIA label to the toggle switch, use the `labelText` input instead',
      });
    });

    it('should not have `aria-label` if `ariaLabel` is empty', () => {
      testComponent.ariaLabel = '';
      fixture.detectChanges();

      const button = getButtonElement(fixture);

      expect(button?.getAttribute('aria-label')).toBeNull();
    });

    it('should make the host element a tab stop', () => {
      expect(buttonElement?.tabIndex).toEqual(0);
    });

    it('should show inline help', () => {
      testComponent.showInlineHelp = true;
      fixture.detectChanges();
      expect(
        toggleNativeElement.querySelector('.sky-help-inline'),
      ).toBeTruthy();
    });

    it('should pass accessibility with label text input and should set `aria-label` to label text', async () => {
      testComponent.labelText = 'label text';
      testComponent.buttonLabel = undefined;

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toEqual(
        getLabelElement(fixture).id,
      );
      expect(buttonElement?.getAttribute('aria-label')).toBe('label text');
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should still have `aria-label` if `labelHidden` is true', () => {
      testComponent.labelText = 'label text';
      testComponent.labelHidden = true;

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-label')).toBe('label text');
    });

    it('should render the `labelText` and not label element if `labelText` is set', () => {
      testComponent.labelText = 'label text';
      testComponent.buttonLabel = 'label element';

      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent?.trim()).toBe('label text');
    });

    it('should not render the label or label element if `labelText` is set and `labelHidden` is true', () => {
      testComponent.labelText = 'label text';
      testComponent.buttonLabel = 'label element';
      testComponent.labelHidden = true;

      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent).toBe('');
    });

    it('should not render the label if `labelText` is set and `labelHidden` is true', () => {
      testComponent.labelText = 'label text';
      testComponent.labelHidden = true;

      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent).toBe('');
    });

    it('should render the label if `labelText` is set', () => {
      testComponent.labelText = 'label text';

      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent).toBe('label text');
    });

    it('should render the label element regardless of `labelHidden` value if `labelText` is not set', () => {
      testComponent.buttonLabel = 'label element';

      fixture.detectChanges();

      const label = getLabelElement(fixture);

      expect(label?.textContent).toBe('label element');

      testComponent.labelHidden = true;
      fixture.detectChanges();

      expect(label?.textContent).toBe('label element');
    });

    it('should pass accessibility with label element and no `ariaLabel`', async () => {
      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toEqual(
        getLabelElement(fixture).id,
      );
      expect(buttonElement?.getAttribute('aria-label')).toBeNull();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should pass accessibility with `ariaLabel` and no label element', async () => {
      testComponent.ariaLabel = 'My aria label';
      testComponent.buttonLabel = undefined;

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toBeNull();
      expect(buttonElement?.getAttribute('aria-label')).toEqual(
        'My aria label',
      );
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should pass accessibility when `ariaLabel` contains the label element contents', async () => {
      // https://dequeuniversity.com/rules/axe/html/3.5/label-content-name-mismatch?application=axeAP
      testComponent.ariaLabel = 'My button label with more content';
      testComponent.buttonLabel = 'My button label';

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toBeNull();
      expect(buttonElement?.getAttribute('aria-label')).toEqual(
        'My button label with more content',
      );
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with mismatched `ariaLabel` and label element content', async () => {
      testComponent.ariaLabel = 'My aria label';
      testComponent.buttonLabel = 'Text that does not match aria label';

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toBeNull();
      expect(buttonElement?.getAttribute('aria-label')).toEqual(
        'My aria label',
      );
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with `ariaLabel` and without label element', async () => {
      testComponent.ariaLabel = 'My aria label';
      testComponent.showLabel = false;

      fixture.detectChanges();
      expect(buttonElement?.getAttribute('aria-labelledby')).toBeNull();
      expect(buttonElement?.getAttribute('aria-label')).toEqual(
        'My aria label',
      );
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should render help inline button if help popover content is provided', () => {
      testComponent.helpPopoverContent = 'popover content';
      testComponent.labelText = 'label text';
      testComponent.showInlineHelp = false;
      testComponent.showLabel = false;

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll(
          'sky-help-inline:not(.sky-control-help)',
        ).length,
      ).toBe(1);
    });

    it('should not render help inline button if title is provided without content', () => {
      testComponent.helpPopoverContent = undefined;
      testComponent.helpPopoverTitle = 'popover title';
      testComponent.labelText = 'label text';
      testComponent.showInlineHelp = false;
      testComponent.showLabel = false;

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll(
          'sky-help-inline:not(.sky-control-help)',
        ).length,
      ).toBe(0);
    });

    it('should render help inline button if help key and label text is provided', () => {
      testComponent.helpKey = 'helpKey.html';
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.sky-help-inline:not(.sky-control-help)',
        ),
      ).toBeFalsy();

      testComponent.labelText = 'Toggle switch';
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.sky-help-inline:not(.sky-control-help)',
        ),
      ).toBeTruthy();
    });

    it('should set global help config with help key', async () => {
      const helpController = TestBed.inject(SkyHelpTestingController);
      testComponent.labelText = 'Text Editor';
      testComponent.helpKey = 'helpKey.html';
      fixture.detectChanges();

      const helpInlineButton = fixture.nativeElement.querySelector(
        '.sky-help-inline',
      ) as HTMLElement | undefined;
      await helpInlineButton?.click();

      fixture.detectChanges();
      await fixture.whenStable();

      helpController.expectCurrentHelpKey('helpKey.html');
    });
  });

  describe('with change event and no initial value', () => {
    let toggleDebugElement: DebugElement;
    let toggleInstance: SkyToggleSwitchComponent;
    let testComponent: SkyToggleSwitchChangeEventFixtureComponent;
    let buttonElement: HTMLButtonElement | null;

    beforeEach(() => {
      fixture = TestBed.createComponent(
        SkyToggleSwitchChangeEventFixtureComponent,
      );

      fixture.detectChanges();

      toggleDebugElement = fixture.debugElement.query(
        By.directive(SkyToggleSwitchComponent),
      );
      toggleInstance = toggleDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      buttonElement = getButtonElement(fixture);
    });

    it('should call not call the change event when the toggle is not interacted with', () => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      toggleInstance.checked = true;
      fixture.detectChanges();

      expect(testComponent.lastEvent).toBeUndefined();
    });

    it('should call the change event and not emit a DOM event to the change output', () => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      // Trigger the click on the buttonElement, because the input will probably
      // emit a DOM event to the change output.
      buttonElement?.click();
      fixture.detectChanges();

      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent?.checked).toEqual(true);
    });
  });

  describe('with provided ariaLabel attribute ', () => {
    it('should use the provided ariaLabel as the input aria-label', () => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      (fixture.componentInstance as SkyToggleSwitchFixtureComponent).ariaLabel =
        'Super effective';
      fixture.detectChanges();

      const buttonElement = getButtonElement(fixture);

      expect(buttonElement?.getAttribute('aria-label')).toEqual(
        'Super effective',
      );
    });
  });

  describe('with provided tabIndex', () => {
    let testComponent: SkyToggleSwitchFixtureComponent;
    let buttonElement: HTMLButtonElement | null;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchFixtureComponent);

      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      testComponent.customTabIndex = 7;
      fixture.detectChanges();

      buttonElement = getButtonElement(fixture);
    });

    it('should preserve any given tabIndex', () => {
      expect(buttonElement?.tabIndex).toEqual(7);
    });

    it('should preserve given tabIndex when the toggle is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(buttonElement?.tabIndex).toEqual(13);
    });
  });

  describe('with ngModel and an initial value', () => {
    let toggleElement: DebugElement;
    let testComponent: SkyToggleSwitchFormDirectivesFixtureComponent;
    let buttonElement: HTMLButtonElement | null;
    let ngModel: NgModel;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(
        SkyToggleSwitchFormDirectivesFixtureComponent,
      );
      testComponent = fixture.debugElement.componentInstance;
      testComponent.modelValue = true;

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(
        By.directive(SkyToggleSwitchComponent),
      );

      buttonElement = getButtonElement(fixture);

      ngModel = toggleElement.injector.get(NgModel);
    }));

    it('should be in pristine, untouched, and valid states', fakeAsync(() => {
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(true);
      expect(ngModel.dirty).toEqual(false);
      expect(ngModel.touched).toEqual(false);
      expect(testComponent.modelValue).toEqual(true);

      buttonElement?.click();

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
    let buttonElement: HTMLButtonElement | null;
    let ngModel: NgModel;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(
        SkyToggleSwitchFormDirectivesFixtureComponent,
      );

      fixture.detectChanges();
      tick();

      toggleElement = fixture.debugElement.query(
        By.directive(SkyToggleSwitchComponent),
      );

      testComponent = fixture.debugElement.componentInstance;

      buttonElement = getButtonElement(fixture);

      ngModel = toggleElement.injector.get(NgModel);
    }));

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(ngModel.pristine).toEqual(true);
      expect(ngModel.dirty).toEqual(false);
      expect(ngModel.touched).toEqual(false);

      buttonElement?.click();

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

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);
      expect(testComponent.modelValue).toEqual(false);

      fixture.detectChanges();

      testComponent.modelValue = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(true);
    }));
  });

  describe('with reactive form', () => {
    let testComponent: SkyToggleSwitchReactiveFormFixtureComponent;
    let buttonElement: HTMLButtonElement | null;
    let formControl: UntypedFormControl;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(
        SkyToggleSwitchReactiveFormFixtureComponent,
      );

      fixture.detectChanges();
      tick();

      testComponent = fixture.debugElement.componentInstance;

      buttonElement = getButtonElement(fixture);

      formControl = testComponent.toggle1;
    }));

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();

      expect(formControl.valid).toEqual(true);
      expect(formControl.pristine).toEqual(true);
      expect(formControl.dirty).toEqual(false);
      expect(formControl.touched).toEqual(false);

      buttonElement?.click();

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

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);
      expect(formControl.value).toEqual(false);

      fixture.detectChanges();

      formControl.setValue(true);

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(true);
    }));

    it('should change disable state through form control programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(buttonElement?.disabled).toEqual(false);
      expect(formControl.value).toEqual(false);

      fixture.detectChanges();

      formControl.disable();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement?.disabled).toEqual(true);
      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);

      formControl.enable();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(buttonElement?.disabled).toEqual(false);
      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);
    }));
  });

  describe('with a consumer using OnPush change detection', () => {
    let testComponent: SkyToggleSwitchOnPushFixtureComponent;
    let buttonElement: HTMLButtonElement | null;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SkyToggleSwitchOnPushFixtureComponent);

      fixture.detectChanges();
      tick();

      testComponent = fixture.debugElement.componentInstance;

      buttonElement = getButtonElement(fixture);
    }));

    it('should change toggle state through ngModel programmatically', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(false);
      expect(testComponent.isChecked).toEqual(false);

      fixture.detectChanges();

      testComponent.isChecked = true;
      testComponent.ref.markForCheck();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        buttonElement?.classList.contains('sky-toggle-switch-checked'),
      ).toEqual(true);
    }));

    it('should handle async labels', fakeAsync(() => {
      testComponent.showLabel = false;
      tick();
      fixture.detectChanges();

      let label = getLabelElement(fixture);

      expect(label).toBeNull();

      testComponent.showLabel = true;
      testComponent.ref.markForCheck();

      tick();
      fixture.detectChanges();

      label = getLabelElement(fixture);

      expect(label).not.toBeNull();
    }));
  });
});
