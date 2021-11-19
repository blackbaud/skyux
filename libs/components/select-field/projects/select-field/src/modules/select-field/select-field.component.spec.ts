import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect, SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyModalService } from '@skyux/modals';

import { SkySelectFieldComponent } from './select-field.component';

import { SkySelectFieldFixturesModule } from './fixtures/select-field-fixtures.module';

import { SkySelectFieldTestComponent } from './fixtures/select-field.component.fixture';

import { SkySelectField } from './types/select-field';

import { SkySelectFieldCustomPicker } from './types/select-field-custom-picker';

import { SkySelectFieldPickerContext } from './select-field-picker-context';

describe('Select field component', () => {
  let fixture: ComponentFixture<SkySelectFieldTestComponent>;
  let component: SkySelectFieldTestComponent;
  let selectField: SkySelectFieldComponent;

  //#region helpers

  function detectNewValue() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function setValue(value: any) {
    component.setValue(value);

    detectNewValue();

    expect(selectField.value).toEqual(value);
  }

  function openPicker() {
    const openSpy = spyOn(selectField, 'openPicker').and.callThrough();
    const openButton = fixture.nativeElement.querySelector('.sky-btn');
    openButton.click();
    tick();
    fixture.detectChanges();
    expect(openSpy).toHaveBeenCalled();
  }

  function savePicker() {
    const modalCloseButton = document.querySelector(
      '.sky-select-field-picker-btn-save'
    );
    (modalCloseButton as HTMLElement).click();
    tick();
    fixture.detectChanges();
  }

  function closePicker() {
    const modalCloseButton = document.querySelector(
      '.sky-select-field-picker-btn-close'
    );
    (modalCloseButton as HTMLElement).click();
    tick();
    fixture.detectChanges();
  }

  function applySearch(searchText: string): void {
    const searchInput = document.querySelector(
      '.sky-search-input'
    ) as HTMLInputElement;
    const searchButton = document.querySelector(
      '.sky-select-field-picker .sky-search-btn-apply'
    ) as HTMLButtonElement;
    searchInput.value = searchText;
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(searchInput, 'change');
    fixture.detectChanges();
    searchButton.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function clickNewButton(): void {
    const modalCloseButton = document.querySelector(
      '.sky-select-field-picker-btn-new'
    );
    (modalCloseButton as HTMLElement).click();

    tick();
    fixture.detectChanges();
  }

  function getTokens(): NodeListOf<any> {
    return document.querySelectorAll('.sky-token');
  }

  function closeToken(index: number) {
    const tokens = getTokens();
    tokens.item(index).querySelector('button').click();
    tick();
    fixture.detectChanges();
  }

  function selectOptions(numToSelect: number) {
    const checkboxes = document.querySelectorAll(
      '.sky-list-view-checklist sky-checkbox input'
    );

    for (let i = 0; i < numToSelect; i++) {
      (checkboxes.item(i) as HTMLElement).click();
      tick();
      fixture.detectChanges();
    }
  }

  function selectOption(index: number) {
    const buttons = document.querySelectorAll(
      '.sky-list-view-checklist-single-button'
    );
    (buttons.item(index) as HTMLElement).click();
    tick();
    fixture.detectChanges();
  }

  function getSingleSelectInnerText(): string {
    return (document.querySelector('.sky-form-control') as HTMLElement)
      .innerText;
  }

  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SkySelectFieldFixturesModule],
    });

    fixture = TestBed.createComponent(SkySelectFieldTestComponent);
    component = fixture.componentInstance;
    selectField = component.selectField;
  });

  afterEach(inject([SkyModalService], (_modalService: SkyModalService) => {
    _modalService.dispose();
    fixture.detectChanges();
    fixture.destroy();
  }));

  describe('basic setup', () => {
    it('should set defaults', () => {
      expect(selectField.ariaLabel).toEqual(undefined);
      expect(selectField.ariaLabelledBy).toEqual(undefined);
      expect(selectField.data).toEqual(undefined);
      expect(selectField.descriptorKey).toEqual('label');
      expect(selectField.disabled).toEqual(false);
      expect(selectField.selectMode).toEqual('multiple');
    });

    it('should provide inputs', () => {
      component.ariaLabel = 'my-aria-label';
      component.ariaLabelledBy = 'my-aria-labelledby';
      component.descriptorKey = 'name';
      component.disabled = true;
      component.selectMode = 'single';
      component.multipleSelectOpenButtonText = 'open';
      component.singleSelectClearButtonTitle = 'clear title';
      component.singleSelectOpenButtonTitle = 'open title';
      component.singleSelectPlaceholderText = 'placeholder';
      component.pickerHeading = 'heading';

      fixture.detectChanges();

      expect(selectField.ariaLabel).toEqual('my-aria-label');
      expect(selectField.ariaLabelledBy).toEqual('my-aria-labelledby');
      expect(selectField.descriptorKey).toEqual('name');
      expect(selectField.disabled).toEqual(true);
      expect(selectField.selectMode).toEqual('single');
      expect(selectField.multipleSelectOpenButtonText).toEqual('open');
      expect(selectField.singleSelectClearButtonTitle).toEqual('clear title');
      expect(selectField.singleSelectOpenButtonTitle).toEqual('open title');
      expect(selectField.singleSelectPlaceholderText).toEqual('placeholder');
      expect(selectField.pickerHeading).toEqual('heading');
    });

    it('should set custom picker heading', fakeAsync(() => {
      component.pickerHeading = 'FOOBAR';
      fixture.detectChanges();
      openPicker();
      fixture.detectChanges();

      const selectFieldHeading: HTMLElement = document.querySelector(
        '.sky-modal-header-content'
      );

      expect(selectFieldHeading.innerText.trim()).toEqual('FOOBAR');

      closePicker();
      fixture.detectChanges();
    }));

    it('should trigger blur event when focus is lost', fakeAsync(() => {
      fixture.detectChanges();

      setValue(undefined);
      openPicker();
      fixture.detectChanges();

      const selectFieldContainer: HTMLElement =
        fixture.nativeElement.querySelector('.sky-select-field');
      SkyAppTestUtility.fireDomEvent(selectFieldContainer, 'focusout');
      fixture.detectChanges();

      closePicker();
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(selectFieldContainer, 'focusout');
      fixture.detectChanges();

      expect(component.touched).toBe(1);

      SkyAppTestUtility.fireDomEvent(selectFieldContainer, 'focusout');
      expect(component.touched).toBe(2);
    }));

    it('should not be touched when value is set programmatically', fakeAsync(() => {
      fixture.detectChanges();

      setValue([component.staticData[0]]);
      fixture.detectChanges();

      expect(component.touched).toBe(0);

      setValue([component.staticData[1]]);
      fixture.detectChanges();

      expect(component.touched).toBe(0);
    }));

    it('should allow programmatically setting value to undefined', fakeAsync(() => {
      fixture.detectChanges();

      // Programmatically set value.
      setValue([component.staticData[0]]);
      fixture.detectChanges();

      // Programmatically set value to undefined.
      setValue(undefined);
      fixture.detectChanges();

      // Expect value to be undefined and form control to remain untouched.
      expect(selectField.value).toBeUndefined();
      expect(component.touched).toBe(0);
    }));
  });

  describe('multiple select', () => {
    it('should set the value from ngModel', fakeAsync(() => {
      fixture.detectChanges();
      setValue([component.staticData[0]]);
      expect(selectField.value[0].id).toEqual(component.staticData[0].id);
    }));

    it('should ignore redundant value updates from ngModel', fakeAsync(() => {
      fixture.detectChanges();

      setValue([component.staticData[0]]);
      fixture.detectChanges();
      expect(component.touched).toBe(0);

      setValue([component.staticData[0]]);
      fixture.detectChanges();
      expect(component.touched).toBe(0);
    }));

    it('should collapse all tokens into one if many options are chosen', fakeAsync(() => {
      fixture.detectChanges();
      setValue([]);
      openPicker();
      selectOptions(6);
      savePicker();
      expect(selectField.value.length).toEqual(6);
      expect(getTokens().length).toEqual(1);
    }));

    it('should refresh value if tokens are closed', fakeAsync(() => {
      fixture.detectChanges();
      setValue([component.staticData[0]]);
      openPicker();
      selectOptions(2); // Click the selected option to unselect it!
      savePicker();
      expect(selectField.value.length).toEqual(1);

      let tokens = getTokens();
      expect(tokens.length).toEqual(1);

      closeToken(0);
      tokens = getTokens();
      expect(selectField.value.length).toEqual(0);
      expect(tokens.length).toEqual(0);
    }));

    it('should handle closing a subsection of all the tokens', fakeAsync(() => {
      fixture.detectChanges();
      setValue([
        component.staticData[0],
        component.staticData[3],
        component.staticData[5],
      ]);
      openPicker();
      selectOptions(2); // Click the selected option to unselect it!
      savePicker();
      expect(selectField.value.length).toEqual(3);

      let tokens = getTokens();
      expect(tokens.length).toEqual(3);

      closeToken(0);
      tokens = getTokens();
      expect(selectField.value.length).toEqual(2);
      expect(tokens.length).toEqual(2);
    }));

    it('should reset tokens if value has been programmatically set to undefined', fakeAsync(() => {
      // Programmatically set value.
      fixture.detectChanges();
      setValue([component.staticData[0]]);
      fixture.detectChanges();

      // Expect tokens to reflect value.
      let tokens = getTokens();
      expect(tokens.length).toEqual(1);

      // Programmatically set value to undefined.
      setValue(undefined);
      fixture.detectChanges();

      // Expect tokens to be removed.
      tokens = getTokens();
      expect(tokens.length).toEqual(0);
    }));
  });

  describe('single select', () => {
    it('should set the value from ngModel', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();
      setValue(component.staticData[0]);
      expect(selectField.value.id).toEqual(component.staticData[0].id);
    }));

    it('should ignore redundant value updates from ngModel', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();

      setValue(component.staticData[0]);
      fixture.detectChanges();
      expect(component.touched).toBe(0);

      setValue(component.staticData[0]);
      fixture.detectChanges();
      expect(component.touched).toBe(0);
    }));

    it('should select a value from the picker', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();
      setValue({});
      openPicker();
      selectOption(0);
      savePicker();
      expect(selectField.value.id).toEqual('1');
    }));

    it('should update the touched value when you select a value from the picker', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();
      setValue({});
      openPicker();
      const selectHTML =
        fixture.nativeElement.querySelector('sky-select-field');
      expect(selectHTML.classList.contains('ng-touched')).toBeFalsy();
      selectOption(0);
      savePicker();
      expect(selectHTML.classList.contains('ng-touched')).toBeTruthy();
    }));

    it('should allow clearing the value and keep focus afterwards', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();
      setValue(component.staticData[0]);
      expect(selectField.value.id).toEqual('1');
      const selector = '.sky-input-group-btn .sky-btn';
      (
        fixture.nativeElement.querySelectorAll(selector).item(0) as HTMLElement
      ).click();
      tick();
      fixture.detectChanges();
      expect(selectField.value).toEqual(undefined);
      expect(document.activeElement.classList).toContain(
        'sky-select-field-btn'
      );
    }));

    it('should reset placeholder text when value is programmatically set to undefined', fakeAsync(() => {
      component.selectMode = 'single';
      fixture.detectChanges();
      const initialInnerText = getSingleSelectInnerText();

      // Open picker and choose the first item.
      setValue({});
      openPicker();
      selectOption(0);
      savePicker();

      // Expect new value to be set and inner text to reflect new value.
      expect(selectField.value.id).toEqual('1');
      expect(initialInnerText).not.toEqual(getSingleSelectInnerText());

      // Programmatically set value to undefined.
      setValue(undefined);
      fixture.detectChanges();

      // Expect undefined value to be set and inner text reset back to initial placeholder.
      expect(selectField.value).toBeUndefined();
      expect(initialInnerText).toEqual(getSingleSelectInnerText());
    }));
  });

  describe('picker', () => {
    it('should open and close the picker', fakeAsync(() => {
      fixture.detectChanges();
      setValue(undefined);
      openPicker();
      selectOptions(1);
      closePicker();

      // Value should be unaffected since we cancelled our selection:
      expect(selectField.value).toBeUndefined();
    }));

    it('should open and save the picker', fakeAsync(() => {
      fixture.detectChanges();
      setValue([]);
      openPicker();
      selectOptions(2);
      savePicker();

      expect(selectField.value.length).toEqual(2);
      expect(selectField.value[0].id).toEqual('1');
      expect(getTokens().length).toEqual(2);
    }));

    it('should allow filtering by category', fakeAsync(() => {
      fixture.detectChanges();
      setValue([]);
      openPicker();

      const filterButton = document.querySelector('.sky-filter-btn');
      (filterButton as HTMLElement).click();
      tick();
      fixture.detectChanges();

      let values = document.querySelectorAll(
        '.sky-list-view-checklist sky-checkbox input'
      );
      expect(values.length).toEqual(6);

      const select = document.querySelector('select') as HTMLSelectElement;
      const option = select.options[1];
      option.setAttribute('selected', 'selected');
      expect(option.value).toEqual('Pome');

      SkyAppTestUtility.fireDomEvent(select, 'change');
      tick();
      fixture.detectChanges();

      values = document.querySelectorAll(
        '.sky-list-view-checklist sky-checkbox input'
      );
      expect(select.options.length).toEqual(5);
      expect(values.length).toEqual(2);
    }));

    it('should support a custom picker', fakeAsync(() => {
      let updateValueFn: (value: SkySelectField[]) => void;

      const customPicker: SkySelectFieldCustomPicker = {
        open: jasmine
          .createSpy('open')
          .and.callFake(
            (
              _pickerContext: SkySelectFieldPickerContext,
              updateValue: (value: SkySelectField[]) => void
            ) => {
              updateValueFn = updateValue;
            }
          ),
      };

      fixture.componentInstance.customPicker = customPicker;

      fixture.detectChanges();

      setValue([component.staticData[1]]);

      openPicker();

      expect(customPicker.open).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: fixture.componentInstance.data,
          selectedValue: [component.staticData[1]],
        }),
        updateValueFn
      );

      // Test multi-select mode.
      updateValueFn([component.staticData[4], component.staticData[6]]);

      detectNewValue();

      expect(selectField.value).toEqual([
        component.staticData[4],
        component.staticData[6],
      ]);

      // Test single-select mode.
      fixture.componentInstance.selectMode = 'single';

      fixture.detectChanges();

      updateValueFn([component.staticData[3]]);

      detectNewValue();

      expect(selectField.value).toEqual(component.staticData[3]);
    }));

    it('should update the touched value when you select a value from the picker', fakeAsync(() => {
      fixture.componentInstance.selectMode = 'single';
      let updateValueFn: (value: SkySelectField[]) => void;

      const customPicker: SkySelectFieldCustomPicker = {
        open: jasmine
          .createSpy('open')
          .and.callFake(
            (
              _pickerContext: SkySelectFieldPickerContext,
              updateValue: (value: SkySelectField[]) => void
            ) => {
              updateValueFn = updateValue;
            }
          ),
      };

      fixture.componentInstance.customPicker = customPicker;

      fixture.detectChanges();
      const selectHTML =
        fixture.nativeElement.querySelector('sky-select-field');
      expect(selectHTML.classList.contains('ng-touched')).toBeFalsy();

      setValue([component.staticData[1]]);

      openPicker();

      updateValueFn([component.staticData[3]]);

      detectNewValue();
      expect(selectHTML.classList.contains('ng-touched')).toBeTruthy();
    }));

    it('should emit searchApplied when a search is applied', fakeAsync(() => {
      fixture.detectChanges();
      openPicker();
      const spy = spyOn(component, 'onSearchApplied').and.callThrough();

      applySearch('foobar');

      expect(spy).toHaveBeenCalled();
    }));

    describe('inMemorySearchEnabled', function () {
      let modalService: SkyModalService;

      beforeEach(inject([SkyModalService], (_modalService: SkyModalService) => {
        modalService = _modalService;
      }));

      it('should set inMemorySearchEnabled to true when the corresponding context property is undefined', fakeAsync(() => {
        const modalSpy = spyOn(modalService, 'open').and.callThrough();

        fixture.componentInstance.inMemorySearchEnabled = undefined;

        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        setValue(undefined);
        openPicker();

        const picker = modalSpy.calls.first().returnValue.componentInstance;

        expect(picker.inMemorySearchEnabled).toEqual(true);
      }));

      it('should set inMemorySearchEnabled to false when the corresponding context property is false', fakeAsync(() => {
        const modalSpy = spyOn(modalService, 'open').and.callThrough();

        fixture.componentInstance.inMemorySearchEnabled = false;

        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        setValue(undefined);
        openPicker();

        const picker = modalSpy.calls.first().returnValue.componentInstance;

        expect(picker.inMemorySearchEnabled).toEqual(false);
      }));

      it('should set inMemorySearchEnabled to true when the corresponding context property is true', fakeAsync(() => {
        const modalSpy = spyOn(modalService, 'open').and.callThrough();

        fixture.componentInstance.inMemorySearchEnabled = true;

        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        setValue(undefined);
        openPicker();

        const picker = modalSpy.calls.first().returnValue.componentInstance;

        expect(picker.inMemorySearchEnabled).toEqual(true);
      }));
    });
  });

  describe('Add new record button', () => {
    it('should emit the new button when it is clicked', fakeAsync(() => {
      selectField.showAddNewRecordButton = true;

      const spy = spyOn(selectField.addNewRecordButtonClick, 'emit');

      fixture.detectChanges();

      setValue(undefined);
      openPicker();
      clickNewButton();

      expect(spy).toHaveBeenCalled();
    }));
  });
});
