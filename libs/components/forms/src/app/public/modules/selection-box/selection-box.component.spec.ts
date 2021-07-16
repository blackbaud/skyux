import { DebugElement } from '@angular/core';

import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  expect,
  expectAsync,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange
} from '@skyux/theme';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkySelectionBoxFixturesModule
} from './fixtures/selection-box-fixtures.module';

import {
  SelectionBoxTestComponent
} from './fixtures/selection-box.component.fixture';

describe('Selection box component', () => {

  //#region helpers
  function getRadioSelectionBoxes(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('#radioSelectionBoxes .sky-selection-box');
  }

  function getCheckboxSelectionBoxes(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('#checkboxSelectionBoxes .sky-selection-box');
  }

  function getDescription(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.sky-selection-box-description');
  }

  function getHeader(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.sky-selection-box-header');
  }

  function getIcon(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.sky-selection-box-icon');
  }

  function getRadioButtons(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('#radioSelectionBoxes input');
  }

  function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('#checkboxSelectionBoxes input');
  }
  //#endregion

  let fixture: ComponentFixture<SelectionBoxTestComponent>;
  let testComponent: SelectionBoxTestComponent;
  let debugElement: DebugElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined
        }
      )
    };

    fixture = TestBed.configureTestingModule({
      imports: [
        SkySelectionBoxFixturesModule
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc
        }
      ]
    }).createComponent(SelectionBoxTestComponent);

    debugElement = fixture.debugElement;

    testComponent = debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('should enable and disable AfterViewInit', async () => {

    let outermostDiv = debugElement.query(By.css('div#checkboxSelectionBoxes > form > sky-selection-box > div')).nativeElement;
    fixture.detectChanges();

    expect(outermostDiv).not.toHaveCssClass('sky-selection-box-disabled');

    fixture.detectChanges();

    testComponent.myForm.get('checkboxes').get('0').disable();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(outermostDiv).toHaveCssClass('sky-selection-box-disabled');

    fixture.detectChanges();

    testComponent.myForm.get('checkboxes').get('0').enable();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(outermostDiv).not.toHaveCssClass('sky-selection-box-disabled');
  });

  it('should transclude icon, header, and description sections', () => {
    expect(getIcon()[0]).not.toBeNull();
    expect(getHeader()[0]).not.toBeNull();
    expect(getDescription()[0]).not.toBeNull();
  });

  it('should interact with radio buttons when clicking on parent selection box', () => {
    const selectionBoxes = getRadioSelectionBoxes();
    const radioButtons = getRadioButtons();
    selectionBoxes[1].click();
    fixture.detectChanges();

    expect(radioButtons[0].checked).toEqual(false);
    expect(radioButtons[1].checked).toEqual(true);
    expect(radioButtons[2].checked).toEqual(false);

    selectionBoxes[2].click();
    fixture.detectChanges();

    expect(radioButtons[0].checked).toEqual(false);
    expect(radioButtons[1].checked).toEqual(false);
    expect(radioButtons[2].checked).toEqual(true);
  });

  it('should interact with checkboxes when clicking on parent selection box', () => {
    const selectionBoxes = getCheckboxSelectionBoxes();
    const checkboxes = getCheckboxes();
    selectionBoxes[1].click();
    fixture.detectChanges();

    expect(checkboxes[0].checked).toEqual(false);
    expect(checkboxes[1].checked).toEqual(true);
    expect(checkboxes[2].checked).toEqual(false);

    selectionBoxes[2].click();
    fixture.detectChanges();

    expect(checkboxes[0].checked).toEqual(false);
    expect(checkboxes[1].checked).toEqual(true);
    expect(checkboxes[2].checked).toEqual(true);
  });

  // Tests that depend on sky-checkbox and sky-radio need to use async.
  it('show selected state when selection box is clicked', async(() => {
    const selectionBoxes = getCheckboxSelectionBoxes();

    selectionBoxes[1].click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(selectionBoxes[0]).not.toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[1]).toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[2]).not.toHaveCssClass('sky-selection-box-selected');
    });
  }));

  // Tests that depend on sky-checkbox and sky-radio need to use async.
  it('show selected state when space key is pressed', async(() => {
    const selectionBoxes = getCheckboxSelectionBoxes();

    SkyAppTestUtility.fireDomEvent(selectionBoxes[1], 'keydown', {
      customEventInit: {
        key: ' '
      }
    });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(selectionBoxes[0]).not.toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[1]).toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[2]).not.toHaveCssClass('sky-selection-box-selected');
    });
  }));

  // Tests that depend on sky-checkbox and sky-radio need to use async.
  it('show selected state when checkbox is clicked', async(() => {
    const selectionBoxes = getCheckboxSelectionBoxes();

    getCheckboxes()[1].click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(selectionBoxes[0]).not.toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[1]).toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[2]).not.toHaveCssClass('sky-selection-box-selected');
    });
  }));

  // Tests that depend on sky-checkbox and sky-radio need to use async.
  it('show selected state when radio button is clicked', async(() => {
    const selectionBoxes = getRadioSelectionBoxes();

    getRadioButtons()[1].click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(selectionBoxes[0]).not.toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[1]).toHaveCssClass('sky-selection-box-selected');
      expect(selectionBoxes[2]).not.toHaveCssClass('sky-selection-box-selected');
    });
  }));

  it('should have a role of button', () => {
    const role: string = getRadioSelectionBoxes()[0].getAttribute('role');
    expect(role).toBe('button');
  });

  it('should have a tabindex of 0', () => {
    const tabIndex: string = getRadioSelectionBoxes()[0].getAttribute('tabindex');
    expect(tabIndex).toBe('0');
  });

  it('should have a tabindex of -1 when the control is disabled', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const disabledSelectionBox =
        fixture.nativeElement.querySelector('#disabled-selection-box .sky-selection-box');
      const tabIndex: string = disabledSelectionBox.getAttribute('tabindex');
      expect(tabIndex).toBe('-1');
    });
  }));

  it('should update tabindex of tabbable children elements to -1', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const tabbableChild = fixture.nativeElement.querySelector('#link');
      expect(tabbableChild.getAttribute('tabindex')).toBe('-1');
    });
  }));

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

});
