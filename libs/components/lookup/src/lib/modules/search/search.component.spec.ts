import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SearchTestComponent } from './fixtures/search.component.fixture';
import { SkySearchModule } from './search.module';

describe('Search component', () => {
  let fixture: ComponentFixture<SearchTestComponent>;
  let component: SearchTestComponent;
  let element: DebugElement;
  let contentInfoProvider: SkyContentInfoProvider;
  let mockThemeSvc: { settingsChange: BehaviorSubject<SkyThemeSettingsChange> };
  let mediaQueryController: SkyMediaQueryTestingController;

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

    TestBed.configureTestingModule({
      declarations: [SearchTestComponent],
      imports: [SkySearchModule],
      providers: [
        provideSkyMediaQueryTesting(),
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        SkyContentInfoProvider,
      ],
    });

    fixture = TestBed.createComponent(SearchTestComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement as DebugElement;

    contentInfoProvider = TestBed.inject(SkyContentInfoProvider);
    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  afterEach(() => {
    fixture.destroy();
  });

  function getInput(): DebugElement {
    return element.query(By.css('input'));
  }

  function dispatchInputTransitionEvents(): void {
    const container = element.nativeElement.querySelector(
      '.sky-search-input-container',
    );
    if (container) {
      container.dispatchEvent(
        new TransitionEvent('transitionstart', { propertyName: 'opacity' }),
      );
      container.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'opacity' }),
      );
    }
  }

  function setInput(text: string): void {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    const inputEl = getInput();
    inputEl.nativeElement.value = text;

    inputEl.nativeElement.dispatchEvent(inputEvent);
    fixture.detectChanges();

    inputEl.nativeElement.dispatchEvent(changeEvent);
    fixture.detectChanges();
  }

  function setNgModel(text: string): void {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const inputEl = getInput();
    inputEl.nativeElement.value = text;

    inputEl.nativeElement.dispatchEvent(inputEvent);
    fixture.detectChanges();
  }

  function triggerInputEnter(): void {
    const inputEl = getInput();
    inputEl.triggerEventHandler('keyup', { which: 13, code: 'Enter' });
    fixture.detectChanges();
  }

  function triggerApplyButton(): void {
    const applyEl = element.query(By.css('.sky-search-btn-apply'));
    applyEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
  }

  function triggerClearButton(): void {
    const clearEl = element.query(By.css('.sky-search-btn-clear'));
    clearEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
  }

  function triggerOpenButton(): Promise<void> {
    const openEl = element.query(By.css('.sky-search-btn-open'));
    openEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    dispatchInputTransitionEvents();
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerDismissButton(): Promise<void> {
    const dismissEl = element.query(By.css('.sky-search-btn-dismiss'));
    dismissEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    dispatchInputTransitionEvents();
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerXsBreakpoint(): Promise<void> {
    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();
    dispatchInputTransitionEvents();
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function triggerLgBreakpoint(): Promise<void> {
    mediaQueryController.setBreakpoint('lg');
    fixture.detectChanges();
    dispatchInputTransitionEvents();
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function verifySearchOpenMobile(): void {
    fixture.detectChanges();
    const searchDismissContainer = element.query(
      By.css('.sky-search-dismiss-container'),
    );
    expect(
      element.query(By.css('.sky-search-btn-open')).nativeElement,
    ).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement).toHaveCssClass(
      'sky-search-dismiss-absolute',
    );
    expect(element.query(By.css('.sky-search-btn-dismiss'))).not.toBeNull();
  }

  function verifySearchOpenFullScreen(): void {
    fixture.detectChanges();
    const searchDismissContainer = element.query(
      By.css('.sky-search-dismiss-container'),
    );
    expect(
      element.query(By.css('.sky-search-btn-open')).nativeElement,
    ).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement).not.toHaveCssClass(
      'sky-search-dismiss-absolute',
    );
    expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
  }

  function verifySearchOpenFullScreenFullWidth(): void {
    fixture.detectChanges();
    const searchDismissContainer = element.query(
      By.css('.sky-search-dismiss-container'),
    );
    expect(
      element.query(By.css('.sky-search-btn-open')).nativeElement,
    ).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).toBeVisible();
    expect(searchDismissContainer.nativeElement).toHaveCssClass(
      'sky-search-dismiss-absolute',
    );
    expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
  }

  function verifySearchClosed(): void {
    fixture.detectChanges();
    const searchDismissContainer = element.query(
      By.css('.sky-search-dismiss-container'),
    );

    expect(
      element.query(By.css('.sky-search-btn-open')).nativeElement,
    ).toBeVisible();
    expect(searchDismissContainer.nativeElement).not.toBeVisible();
    expect(searchDismissContainer.nativeElement).not.toHaveCssClass(
      'sky-search-dismiss-absolute',
    );
  }

  describe('standard search', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should apply search text on enter press', () => {
      setInput('my search text');
      const inputEl = getInput();

      inputEl.triggerEventHandler('keyup', { which: 23 });
      fixture.detectChanges();
      expect(component.lastSearchTextApplied).not.toBe('my search text');

      triggerInputEnter();

      expect(component.lastSearchTextApplied).toBe('my search text');
    });

    it('should apply search text on apply button press', () => {
      setInput('applied text');
      triggerApplyButton();
      expect(component.lastSearchTextApplied).toBe('applied text');
    });

    it('should trim search text on apply button press', () => {
      setInput('  applied text   ');
      triggerApplyButton();
      expect(component.lastSearchTextApplied).toBe('applied text');
    });

    it('should search correctly with empty search text is applied', () => {
      component.searchComponent.applySearchText(undefined);
      expect(component.lastSearchTextApplied).toBeUndefined();
    });

    it('should emit search change event on ngModel change', async () => {
      setNgModel('change text');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.lastSearchTextChanged).toBe('change text');
      expect(component.lastSearchTextApplied).not.toBe('change text');
    });

    it('should set default placeholder text when none is specified', () => {
      fixture.detectChanges();

      expect(getInput().attributes['placeholder']).toBe('Find in this list');
    });

    it('should override default placeholder text when placeholder text is provided', () => {
      component.placeholderText = 'hey ya';
      fixture.detectChanges();
      expect(getInput().attributes['placeholder']).toBe('hey ya');
    });

    it('should show the clear button when search is applied', () => {
      expect(
        element.query(By.css('.sky-input-group-clear')).nativeElement,
      ).not.toBeVisible();
      setInput('applied text');
      triggerApplyButton();

      expect(
        element.query(By.css('.sky-input-group-clear')).nativeElement,
      ).toBeVisible();
    });

    it('should emit the apply event when clear button is clicked', fakeAsync(() => {
      setInput('applied text');
      triggerApplyButton();
      triggerClearButton();
      tick(10);

      expect(
        element.query(By.css('.sky-input-group-clear')).nativeElement,
      ).not.toBeVisible();
      expect(component.lastSearchTextApplied).toBe('');
      expect(component.lastSearchTextChanged).toBe('');
    }));

    it('should emit the apply event when search text is cleared via the `searchText` binding to an empty string', fakeAsync(() => {
      setNgModel('applied text');
      fixture.detectChanges();
      tick();

      expect(component.lastSearchTextChanged).toBe('applied text');

      component.searchText = '';
      fixture.detectChanges();
      tick(10);

      expect(component.lastSearchTextChanged).toBe('');

      setNgModel('applied text');
      fixture.detectChanges();
      tick(10);

      expect(component.lastSearchTextChanged).toBe('applied text');
    }));

    it('should emit the apply event when search text is cleared via the `searchText` binding to undefined', async () => {
      component.searchText = 'applied text';
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.lastSearchTextChanged).toBe('applied text');

      component.searchText = undefined;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.lastSearchTextChanged).toBe('');

      component.searchText = 'applied text';
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.lastSearchTextChanged).toBe('applied text');
    });

    it('should emit the change event when text is given, then cleared, and then reset to the same value', fakeAsync(() => {
      setNgModel('applied text');
      fixture.detectChanges();
      tick();

      expect(component.lastSearchTextChanged).toBe('applied text');

      triggerClearButton();
      fixture.detectChanges();
      tick(10);

      expect(component.lastSearchTextChanged).toBe('');

      setNgModel('applied text');
      fixture.detectChanges();
      tick(10);

      expect(component.lastSearchTextChanged).toBe('applied text');
    }));

    it('should emit the cleared event when clear button is clicked', () => {
      spyOn(component.searchComponent.searchClear, 'emit').and.callThrough();
      setInput('applied text');
      triggerApplyButton();
      triggerClearButton();

      expect(
        element.query(By.css('.sky-input-group-clear')).nativeElement,
      ).not.toBeVisible();
      expect(component.searchComponent.searchClear.emit).toHaveBeenCalled();
    });

    it('should disable the input correctly', async () => {
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      let input: HTMLInputElement = getInput().nativeElement;
      expect(input.disabled).toBeFalse();

      component.disabled = true;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      input = getInput().nativeElement;
      expect(input.disabled).toBeTrue();

      component.disabled = undefined;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      input = getInput().nativeElement;
      expect(input.disabled).toBeFalse();
    });

    it('should update search text when applySearchText is called with new search text', () => {
      component.searchComponent.applySearchText('new search text');
      fixture.detectChanges();
      expect(component.lastSearchTextApplied).toBe('new search text');

      component.searchComponent.applySearchText('');
      fixture.detectChanges();
      expect(component.lastSearchTextApplied).toBe('');
    });

    it('should set the clear button visibility when search binding changed', () => {
      component.searchText = 'whatUp';
      fixture.detectChanges();
      expect(
        element.query(By.css('.sky-input-group-clear')).nativeElement,
      ).toBeVisible();
    });

    it('should delay the search if debounce is used', fakeAsync(() => {
      component.searchComponent.searchTextChanged('debounce this please');
      fixture.detectChanges();
      tick(1);
      fixture.detectChanges();
      expect(component.lastSearchTextChanged).toBe('debounce this please');
      component.debounceTime = 10;
      fixture.detectChanges();
      component.searchComponent.searchTextChanged('debounce this please 2');
      fixture.detectChanges();
      tick(1);
      fixture.detectChanges();
      expect(component.lastSearchTextChanged).toBe('debounce this please');
      tick(10);
      fixture.detectChanges();
      expect(component.lastSearchTextChanged).toBe('debounce this please 2');
      component.debounceTime = undefined;
      fixture.detectChanges();
      component.searchComponent.searchTextChanged('debounce this please 3');
      fixture.detectChanges();
      tick(1);
      fixture.detectChanges();
      expect(component.lastSearchTextChanged).toBe('debounce this please 3');
    }));

    it('should set focus when opening the search input', async () => {
      await triggerXsBreakpoint();
      fixture.detectChanges();
      await triggerOpenButton();
      fixture.detectChanges();
      await fixture.whenStable();
      const inputEl = getInput();
      expect(document.activeElement).toBe(inputEl.nativeElement);
    });

    describe('animations', () => {
      describe('should animate the mobile search input open', () => {
        it('when the open button is pressed', async () => {
          await triggerXsBreakpoint();
          fixture.detectChanges();
          await triggerOpenButton();
          verifySearchOpenMobile();
        });

        it('when the screen changes from xsmall to large and the input is hidden', async () => {
          await triggerXsBreakpoint();
          fixture.detectChanges();
          await triggerLgBreakpoint();
          verifySearchOpenFullScreen();
        });

        it('when the screen changes from xsmall to large and the input is shown', async () => {
          await triggerXsBreakpoint();
          fixture.detectChanges();
          await triggerOpenButton();
          fixture.detectChanges();
          await triggerLgBreakpoint();
          verifySearchOpenFullScreen();
        });

        it('when searchText binding is changed and screen is xsmall', async () => {
          await triggerXsBreakpoint();
          fixture.detectChanges();
          component.searchText = 'my search text';
          fixture.detectChanges();
          dispatchInputTransitionEvents();
          await fixture.whenStable();
          verifySearchOpenMobile();
          expect(getInput().properties['value']).toBe('my search text');
        });
      });

      describe('should animate the mobile search input closed', () => {
        it('and show a button when screen is xsmall', async () => {
          expect(element.query(By.css('.sky-search-btn-dismiss'))).toBeNull();
          await triggerXsBreakpoint();
          verifySearchClosed();
        });

        it('when the dismiss button is pressed', async () => {
          await triggerXsBreakpoint();
          fixture.detectChanges();
          await triggerOpenButton();
          fixture.detectChanges();
          await triggerDismissButton();
          verifySearchClosed();
        });

        it('should show applied indication when search is applied', async () => {
          setInput('applied stuff');
          triggerApplyButton();
          await triggerXsBreakpoint();
          fixture.detectChanges();
          expect(
            element.query(By.css('.sky-search-btn-open')).nativeElement,
          ).toHaveCssClass('sky-search-btn-open-applied');
        });
      });

      it('should remove the min-width property after animating', async () => {
        await triggerXsBreakpoint();
        fixture.detectChanges();
        let containerEl: HTMLElement = element.query(
          By.css('.sky-search-input-container'),
        ).nativeElement;
        expect(containerEl.style.minWidth).toBeFalsy();
        await triggerLgBreakpoint();
        verifySearchOpenFullScreen();
        containerEl = element.query(
          By.css('.sky-search-input-container'),
        ).nativeElement;
        expect(containerEl.style.minWidth).toBeFalsy();
      });

      it('should ignore non-opacity transition events', async () => {
        await triggerXsBreakpoint();
        fixture.detectChanges();
        const containerEl = element.query(
          By.css('.sky-search-input-container'),
        ).nativeElement;
        containerEl.dispatchEvent(
          new TransitionEvent('transitionstart', { propertyName: 'width' }),
        );
        containerEl.dispatchEvent(
          new TransitionEvent('transitionend', { propertyName: 'width' }),
        );
        fixture.detectChanges();
        // State should not have changed from the 'width' events.
        verifySearchClosed();
      });
    });

    describe('expandMode none', () => {
      it('do nothing when open button pressed', async () => {
        component.expandMode = 'none';
        fixture.detectChanges();
        await triggerXsBreakpoint();
        fixture.detectChanges();
        verifySearchOpenFullScreen();
        await triggerOpenButton();
        fixture.detectChanges();
        verifySearchOpenFullScreen();
      });
    });

    describe('expandMode fit', () => {
      it('do nothing when open button pressed', async () => {
        component.expandMode = 'fit';
        fixture.detectChanges();
        await triggerXsBreakpoint();
        fixture.detectChanges();
        verifySearchOpenFullScreenFullWidth();
        await triggerOpenButton();
        fixture.detectChanges();
        verifySearchOpenFullScreenFullWidth();
      });
    });

    describe('expandMode responsive', () => {
      it('should become the selected mode when expandMode is cleared', async () => {
        component.expandMode = 'fit';
        fixture.detectChanges();

        component.expandMode = undefined;
        fixture.detectChanges();

        await triggerXsBreakpoint();
        fixture.detectChanges();
        verifySearchClosed();
      });
    });
  });

  describe('initialize expandMode none', () => {
    it('should do nothing when open button pressed', async () => {
      component.expandMode = 'none';
      fixture.detectChanges();
      await triggerXsBreakpoint();
      fixture.detectChanges();
      verifySearchOpenFullScreen();
      await triggerOpenButton();
      fixture.detectChanges();
      verifySearchOpenFullScreen();
    });
  });

  describe('a11y', () => {
    it('should be accessible using default theme at wide and small breakpoints (ariaLabel: undefined, ariaLabelledBy: undefined)', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Search items');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using default theme at wide and small breakpoints (ariaLabel: "Test label", ariaLabelledBy: undefined)', async () => {
      component.ariaLabel = 'Test label';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Test label');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using default theme at wide and small breakpoints (ariaLabel: "Search constituents" - via content info, ariaLabelledBy: undefined)', async () => {
      contentInfoProvider.patchInfo({
        descriptor: { value: 'constituents', type: 'text' },
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Search constituents');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using default theme at wide and small breakpoints (ariaLabel: "Overwritten label" - overwriting content info, ariaLabelledBy: undefined)', async () => {
      contentInfoProvider.patchInfo({
        descriptor: { value: 'constituents', type: 'text' },
      });
      component.ariaLabel = 'Overwritten label';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Overwritten label');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using default theme at wide and small breakpoints (ariaLabel: undefined, ariaLabelledBy: "test-label")', async () => {
      component.ariaLabelledBy = 'test-label';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBeUndefined();
      expect(getInput().attributes['aria-labelledby']).toBe('test-label');
    });

    it('should be accessible using modern theme at wide and small breakpoints (ariaLabel: undefined, ariaLabelledBy: undefined)', async () => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Search items');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using modern theme at wide and small breakpoints (ariaLabel: "Test label", ariaLabelledBy: undefined)', async () => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
      });
      component.ariaLabel = 'Test label';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBe('Test label');
      expect(getInput().attributes['aria-labelledby']).toBeUndefined();
    });

    it('should be accessible using modern theme at wide and small breakpoints (ariaLabel: undefined, ariaLabelledBy: "test-label")', async () => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
      });
      component.ariaLabelledBy = 'test-label';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      setInput('foo bar');
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
      expect(getInput().attributes['aria-label']).toBeUndefined();
      expect(getInput().attributes['aria-labelledby']).toBe('test-label');
    });
  });
});
