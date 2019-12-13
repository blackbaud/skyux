import {
  DebugElement
} from '@angular/core';

import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyInlineFormFixtureComponent
} from './fixtures/inline-form.fixture';

import {
  SkyInlineFormFixtureModule
} from './fixtures/inline-form.fixture.module';

import {
  SkyInlineFormButtonLayout
} from './types/inline-form-button-layout';

function getPrimaryButton(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(
    By.css('.sky-inline-form-footer .sky-btn-primary')
  );
}

function getDefaultButton(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(
    By.css('.sky-inline-form-footer .sky-btn-default')
  );
}

function getLinkButton(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(
    By.css('.sky-inline-form-footer .sky-btn-link')
  );
}

function verifyDoneButtonisDefined(fixture: ComponentFixture<any>, isDefined: boolean): void {
  const doneButton = getPrimaryButton(fixture);
  expect(doneButton).not.toBeNull();

  if (isDefined) {
    expect(doneButton.nativeElement.textContent).toContain('Done');
  } else {
    expect(doneButton.nativeElement.textContent).not.toContain('Done');
  }
}

function verifySaveButtonisDefined(fixture: ComponentFixture<any>, isDefined: boolean): void {
  const saveButton = getPrimaryButton(fixture);
  expect(saveButton).not.toBeNull();

  if (isDefined) {
    expect(saveButton.nativeElement.textContent).toContain('Save');
  } else {
    expect(saveButton.nativeElement.textContent).not.toContain('Save');
  }
}

function verifyDeleteButtonIsDefined(fixture: ComponentFixture<SkyInlineFormFixtureComponent>, isDefined: boolean): void {
  const deleteButton = getDefaultButton(fixture);
  if (isDefined) {
    expect(deleteButton).not.toBeNull();
    expect(deleteButton.nativeElement.textContent).toContain('Delete');
  } else {
    expect(deleteButton).toBeNull();
  }
}

function verifyCancelButtonIsDefined(fixture: ComponentFixture<SkyInlineFormFixtureComponent>, isDefined: boolean): void {
  const cancelButton = getLinkButton(fixture);
  if (isDefined) {
    expect(cancelButton).not.toBeNull();
    expect(cancelButton.nativeElement.textContent).toContain('Cancel');
  } else {
    expect(cancelButton).toBeNull();
  }
}

describe('Inline form component', () => {
  let component: SkyInlineFormFixtureComponent,
  fixture: ComponentFixture<SkyInlineFormFixtureComponent>;

  function showForm() {
    component.showForm = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyInlineFormFixtureModule
      ]
    });

    fixture = TestBed.createComponent(SkyInlineFormFixtureComponent);
    component = fixture.componentInstance;
  });

  it('should show Done/Cancel buttons as default if no SkyInlineFormConfig is defined', fakeAsync(() => {
    showForm();

    verifyDoneButtonisDefined(fixture, true);
    verifyCancelButtonIsDefined(fixture, true);
    verifySaveButtonisDefined(fixture, false);
    verifyDeleteButtonIsDefined(fixture, false);
  }));

  it('should show delete Done/Delete/Cancel buttons when SkyInlineFormConfig is defined', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.DoneDeleteCancel
    };
    showForm();

    verifyDoneButtonisDefined(fixture, true);
    verifyDeleteButtonIsDefined(fixture, true);
    verifyCancelButtonIsDefined(fixture, true);
    verifySaveButtonisDefined(fixture, false);
  }));

  it('should show delete Save/Delete/Cancel buttons when SkyInlineFormConfig is defined', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.SaveDeleteCancel
    };
    showForm();

    verifySaveButtonisDefined(fixture, true);
    verifyDeleteButtonIsDefined(fixture, true);
    verifyCancelButtonIsDefined(fixture, true);
    verifyDoneButtonisDefined(fixture, false);
  }));

  it('should show delete Save/Cancel buttons when SkyInlineFormConfig is defined', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.SaveCancel
    };
    showForm();

    verifySaveButtonisDefined(fixture, true);
    verifyCancelButtonIsDefined(fixture, true);
    verifyDeleteButtonIsDefined(fixture, false);
    verifyDoneButtonisDefined(fixture, false);
  }));

  it('should emit when done button is clicked', fakeAsync(() => {
    showForm();

    const spy = spyOn(component, 'onClose');
    const saveButton = getPrimaryButton(fixture);

    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      reason: 'done'
    });
  }));

  it('should emit when cancel button is clicked', fakeAsync(() => {
    showForm();

    const spy = spyOn(component, 'onClose');
    const cancelButton = getLinkButton(fixture);

    cancelButton.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      reason: 'cancel'
    });
  }));

  it('should emit when delete button is clicked', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.SaveDeleteCancel
    };
    showForm();

    const spy = spyOn(component, 'onClose');
    const deleteButton = getDefaultButton(fixture);

    deleteButton.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      reason: 'delete'
    });
  }));

  it('should emit when save button is clicked', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.SaveCancel
    };
    showForm();

    const spy = spyOn(component, 'onClose');
    const saveButton = getPrimaryButton(fixture);

    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      reason: 'save'
    });
  }));

  it('should properly set up custom buttons', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.Custom,
      buttons: [
        { action: 'CUSTOM_ACTION_1', text: 'CUSTOM_TEXT_1', styleType: 'primary' },
        { action: 'CUSTOM_ACTION_2', text: 'CUSTOM_TEXT_2', styleType: 'default' },
        { action: 'CUSTOM_ACTION_3', text: 'CUSTOM_TEXT_3', styleType: 'link' }
      ]
    };
    showForm();

    const spy = spyOn(component, 'onClose');
    const button1 = getPrimaryButton(fixture);
    const button2 = getDefaultButton(fixture);
    const button3 = getLinkButton(fixture);

    // Expect first button has custom text and emits properly.
    button1.nativeElement.click();
    fixture.detectChanges();

    expect(button1.nativeElement.textContent).toContain('CUSTOM_TEXT_1');
    expect(button2.nativeElement.textContent).toContain('CUSTOM_TEXT_2');
    expect(button3.nativeElement.textContent).toContain('CUSTOM_TEXT_3');
    expect(spy).toHaveBeenCalledWith({
      reason: 'CUSTOM_ACTION_1'
    });
  }));

  it('should focus the first focusable element when no autofocus is inside of content', fakeAsync(() => {
    component.showFormWithOutAutocomplete = true;
    showForm();

    fixture.whenStable().then(() => {
      expect(document.activeElement).toEqual(document.querySelector('#demo-input-3'));
    });
  }));

  it('should focus the autofocus element when there is one present', fakeAsync(() => {
    component.showFormWithAutocomplete = true;
    showForm();

    fixture.whenStable().then(() => {
      expect(document.activeElement).toEqual(document.querySelector('#demo-input-6'));
    });
  }));

  it('should focus the first element thats visible', fakeAsync(() => {
    component.showFormWithHiddenElements = true;
    showForm();

    fixture.whenStable().then(() => {
      expect(document.activeElement).toEqual(document.querySelector('#demo-input-8'));
    });
  }));

  it('should not move focus if there are no focusable elements in the form', fakeAsync(() => {
    component.showFormWithNoElements = true;
    showForm();

    fixture.whenStable().then(() => {
      expect(document.activeElement).toEqual(document.querySelector('#demo-input-1'));
    });
  }));

  it('should change the buttons when config input is changed', fakeAsync(() => {
    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.Custom,
      buttons: [
        { action: 'CUSTOM_ACTION_1', text: 'CUSTOM_TEXT_1', styleType: 'primary' },
        { action: 'CUSTOM_ACTION_2', text: 'CUSTOM_TEXT_2', styleType: 'default' },
        { action: 'CUSTOM_ACTION_3', text: 'CUSTOM_TEXT_3', styleType: 'link' }
      ]
    };
    showForm();

    component.config = {
      buttonLayout: SkyInlineFormButtonLayout.Custom,
      buttons: [
        { action: 'CUSTOM_ACTION_1', text: 'CUSTOM_TEXT_CHANGED_1', styleType: 'primary' },
        { action: 'CUSTOM_ACTION_2', text: 'CUSTOM_TEXT_CHANGED_2', styleType: 'default' }
      ]
    };

    fixture.detectChanges();

    const button1 = getPrimaryButton(fixture);
    const button2 = getDefaultButton(fixture);
    const button3 = getLinkButton(fixture);

    expect(button1.nativeElement.textContent).toContain('CUSTOM_TEXT_CHANGED_1');
    expect(button2.nativeElement.textContent).toContain('CUSTOM_TEXT_CHANGED_2');
    expect(button3).toBeNull();
  }));

  it('should pass accessibility', async(() => {
    component.showForm = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
