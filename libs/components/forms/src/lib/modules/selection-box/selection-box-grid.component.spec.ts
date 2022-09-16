import {
  ComponentFixture,
  TestBed,
  async,
  waitForAsync,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCoreAdapterService } from '@skyux/core';
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
      '.sky-selection-box-grid .sky-selection-box'
    );
  }
  //#endregion

  let fixture: ComponentFixture<SelectionBoxGridTestComponent>;
  let component: SelectionBoxGridTestComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

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
      'sky-selection-box-grid-align-left'
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-center'
    );
  });

  it('should set proper CSS classess when alignItems is set to center', () => {
    component.alignItems = 'center';
    fixture.detectChanges();

    expect(getSelectionBoxGrid()).not.toHaveCssClass(
      'sky-selection-box-grid-align-left'
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-center'
    );
  });

  it('should set proper CSS classess when alignItems is set to left', () => {
    component.alignItems = 'left';
    fixture.detectChanges();

    expect(getSelectionBoxGrid()).not.toHaveCssClass(
      'sky-selection-box-grid-align-center'
    );
    expect(getSelectionBoxGrid()).toHaveCssClass(
      'sky-selection-box-grid-align-left'
    );
  });

  it(`should sync all child selection boxes to have the same height as the tallest selection box`, () => {
    const selectionBoxes = getSelectionBoxes();
    const newHeight = selectionBoxes[0].getBoundingClientRect().height;

    // Fixture has a single hard-coded selection box of 500px,
    // so the other selection boxes should be atleast 500px tall.
    expect(newHeight).toBeGreaterThanOrEqual(500);
    for (let i = 0; i < selectionBoxes.length; i++) {
      expect(selectionBoxes[i].getBoundingClientRect().height).toEqual(
        newHeight
      );
    }
  });

  it(`should update CSS responsive classes on window resize`, async(() => {
    const setResponsiveClassSpy = spyOn(
      SkySelectionBoxAdapterService.prototype,
      'setResponsiveClass'
    );
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth'
    ).and.returnValue(300);
    expect(setResponsiveClassSpy).not.toHaveBeenCalled();

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    expect(setResponsiveClassSpy).toHaveBeenCalledTimes(1);
  }));

  it(`should recalculate heights when child DOM elements change`, waitForAsync(async () => {
    const resetHeightSpy = spyOn(
      SkyCoreAdapterService.prototype,
      'resetHeight'
    );
    const syncMaxHeightSpy = spyOn(
      SkyCoreAdapterService.prototype,
      'syncMaxHeight'
    );
    spyOn(
      SkySelectionBoxAdapterService.prototype,
      'getParentWidth'
    ).and.returnValue(300);
    expect(resetHeightSpy).not.toHaveBeenCalled();
    expect(syncMaxHeightSpy).not.toHaveBeenCalled();

    component.dynamicDescription = `Something really really really really really really really really really really really really really really really long to force a large height than before!`;
    fixture.detectChanges();
    await fixture.whenStable();
    setTimeout(() => {
      expect(resetHeightSpy).toHaveBeenCalledTimes(1);
      expect(syncMaxHeightSpy).toHaveBeenCalledTimes(1);
    });
  }));

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
