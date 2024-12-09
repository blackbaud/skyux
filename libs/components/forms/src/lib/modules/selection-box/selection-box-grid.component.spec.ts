import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCoreAdapterService, SkyMediaBreakpoints } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkySelectionBoxFixturesModule } from './fixtures/selection-box-fixtures.module';
import { SelectionBoxGridTestComponent } from './fixtures/selection-box-grid.component.fixture';
import { SkySelectionBoxAdapterService } from './selection-box-adapter.service';

describe('Selection box grid component', () => {
  //#region helpers
  function getSelectionBoxGrid(): HTMLElement {
    return fixture.nativeElement.querySelector('.sky-selection-box-grid');
  }

  function getSelectionBoxes(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-selection-box-grid .sky-selection-box',
    );
  }

  // Wait for the next change detection cycle. This avoids having nested setTimeout() calls
  // and using the Jasmine done() function.
  function waitForMutationObserver(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve());
    });
  }
  //#endregion

  let fixture: ComponentFixture<SelectionBoxGridTestComponent>;
  let component: SelectionBoxGridTestComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let setResponsiveClassSpy: jasmine.Spy;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    setResponsiveClassSpy = spyOn(
      SkySelectionBoxAdapterService.prototype,
      'setResponsiveClass',
    );

    fixture = TestBed.configureTestingModule({
      imports: [SkySelectionBoxFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    }).createComponent(SelectionBoxGridTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set alignItems to center by default', () => {
    expect(getSelectionBoxGrid()).not.toHaveCssClass(
      'sky-selection-box-grid-align-left',
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-center',
    );
  });

  it('should set proper CSS classes when alignItems is set to center', () => {
    component.alignItems = 'center';
    fixture.detectChanges();

    expect(getSelectionBoxGrid()).not.toHaveCssClass(
      'sky-selection-box-grid-align-left',
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-center',
    );
  });

  it('should set proper CSS classes when alignItems is set to left', () => {
    component.alignItems = 'left';
    fixture.detectChanges();

    expect(getSelectionBoxGrid()).not.toHaveCssClass(
      'sky-selection-box-grid-align-center',
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-left',
    );
  });

  it(`should sync all child selection boxes to have the same height as the tallest selection box`, async () => {
    await waitForMutationObserver();
    const selectionBoxes = getSelectionBoxes();
    const newHeight = selectionBoxes[0].getBoundingClientRect().height;

    // Fixture has a single hard-coded selection box of 500px,
    // so the other selection boxes should be at least 500px tall.
    expect(newHeight).toBeGreaterThanOrEqual(500);
    for (const selectionBox of Array.from(selectionBoxes)) {
      expect(selectionBox.getBoundingClientRect().height).toEqual(newHeight);
    }
  });

  it(`should update CSS responsive classes on window resize`, () => {
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth',
    ).and.returnValue(300);
    setResponsiveClassSpy.calls.reset();
    expect(setResponsiveClassSpy).not.toHaveBeenCalled();

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    expect(setResponsiveClassSpy).toHaveBeenCalledTimes(1);
  });

  it('should set responsive CSS class to large', () => {
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth',
    ).and.callThrough();
    fixture.detectChanges();

    expect(setResponsiveClassSpy).toHaveBeenCalledWith(
      jasmine.any(ElementRef),
      SkyMediaBreakpoints.lg,
    );
  });

  it('should set responsive CSS class to large when outer container is toggled', () => {
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth',
    ).and.callThrough();
    fixture.detectChanges();

    expect(setResponsiveClassSpy).toHaveBeenCalledWith(
      jasmine.any(ElementRef),
      SkyMediaBreakpoints.lg,
    );

    setResponsiveClassSpy.calls.reset();
    component.render = false;
    fixture.detectChanges();

    component.render = true;
    fixture.detectChanges();

    expect(setResponsiveClassSpy).toHaveBeenCalledWith(
      jasmine.any(ElementRef),
      SkyMediaBreakpoints.lg,
    );
  });

  it(`should recalculate heights when child DOM elements change`, async () => {
    const resetHeightSpy = spyOn(
      SkyCoreAdapterService.prototype,
      'resetHeight',
    );
    const syncMaxHeightSpy = spyOn(
      SkyCoreAdapterService.prototype,
      'syncMaxHeight',
    );
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth',
    ).and.returnValue(300);
    expect(resetHeightSpy).not.toHaveBeenCalled();
    expect(syncMaxHeightSpy).not.toHaveBeenCalled();

    component.dynamicDescription = `Something really really really really really really really really really really really really really really really long to force a large height than before!`;
    fixture.detectChanges();
    await fixture.whenStable();
    await waitForMutationObserver();
    expect(resetHeightSpy).toHaveBeenCalledTimes(1);
    expect(syncMaxHeightSpy).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
