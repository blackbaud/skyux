import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeModule,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SortTestComponent } from './fixtures/sort.component.fixture';
import { SkySortModule } from './sort.module';

describe('Sort component', () => {
  let fixture: ComponentFixture<SortTestComponent>;
  let component: SortTestComponent;
  let contentInfo: SkyContentInfoProvider;
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

    TestBed.configureTestingModule({
      declarations: [SortTestComponent],
      imports: [SkySortModule, SkyThemeModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        SkyContentInfoProvider,
      ],
    });

    fixture = TestBed.createComponent(SortTestComponent);
    component = fixture.componentInstance;

    contentInfo = TestBed.inject(SkyContentInfoProvider);
  });

  function getDropdownButtonEl(): HTMLElement | null {
    return document.querySelector('.sky-dropdown-button');
  }

  function getDropdownMenuEl(): HTMLElement | null {
    return document.querySelector('.sky-dropdown-menu');
  }

  function getDropdownMenuHeadingEl(): HTMLElement | null {
    return document.querySelector('sky-sort-menu-heading');
  }

  function getSortItems(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.sky-sort-item');
  }

  function verifyTextPresent(): void {
    expect(getDropdownButtonEl()?.innerText.trim()).toBe('Sort');
  }

  function verifyTextNotPresent(): void {
    expect(getDropdownButtonEl()?.innerText.trim()).not.toBe('Sort');
  }

  it('creates a sort dropdown that respects active input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl).not.toBeNull();

    dropdownButtonEl?.click();
    fixture.detectChanges();
    tick();

    expect(getDropdownMenuHeadingEl()).toHaveText('Sort by');

    const itemsEl = getSortItems();
    expect(itemsEl.length).toBe(6);
    expect(itemsEl.item(2)).toHaveCssClass('sky-sort-item-selected');
    expect(itemsEl.item(2)).toHaveText('Date created (newest first)');
  }));

  it('creates a sort dropdown with the proper label and title', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl?.getAttribute('aria-label')).toBe('Sort');
    expect(dropdownButtonEl?.getAttribute('title')).toBe('Sort');

    dropdownButtonEl?.click();
    fixture.detectChanges();
    tick();

    expect(getDropdownMenuEl()?.getAttribute('aria-labelledby')).toBe(
      getDropdownMenuHeadingEl()?.getAttribute('id')
    );
  }));

  it('creates a sort dropdown with a specified aria label', fakeAsync(() => {
    component.ariaLabel = 'Test label';
    fixture.detectChanges();
    tick();
    const dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl?.getAttribute('aria-label')).toBe('Test label');
  }));

  it('should use the content info provider for aria label when applicable', () => {
    contentInfo.patchInfo({
      descriptor: { value: 'constituents', type: 'text' },
    });
    fixture.detectChanges();

    const dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl?.getAttribute('aria-label')).toBe(
      'Sort constituents'
    );
  });

  it('should not use the content info provider for aria label when overwritten', () => {
    contentInfo.patchInfo({
      descriptor: { value: 'constituents', type: 'text' },
    });
    component.ariaLabel = 'Overwritten label';
    fixture.detectChanges();

    const dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl?.getAttribute('aria-label')).toBe(
      'Overwritten label'
    );
  });

  it('changes active item on click and emits proper event', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const dropdownButtonEl = getDropdownButtonEl();
    dropdownButtonEl?.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    let itemsEl = getSortItems();
    const clickItem = itemsEl.item(1).querySelector('button') as HTMLElement;

    clickItem.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    console.log(component.sortedItem);

    expect(component.sortedItem).toEqual({
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true,
    });

    dropdownButtonEl?.click();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    itemsEl = getSortItems();
    expect(itemsEl.item(1)).toHaveCssClass('sky-sort-item-selected');
  }));

  it('can set active input programmatically', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.initialState = 4;
    fixture.detectChanges();
    tick();

    const button = getDropdownButtonEl();
    button?.click();
    fixture.detectChanges();
    tick();

    const itemsEl = getSortItems();
    expect(itemsEl.item(3)).toHaveCssClass('sky-sort-item-selected');
  }));

  it('should allow button text to be hidden', () => {
    fixture.detectChanges();
    verifyTextNotPresent();
    component.showButtonText = true;
    fixture.detectChanges();
    verifyTextPresent();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should use modern icon when applicable', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const defaultIcon = fixture.nativeElement.querySelector(
      'sky-dropdown-button sky-icon i'
    );
    expect(defaultIcon).toHaveCssClass('fa-sort');

    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light
      ),
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings,
    });

    fixture.detectChanges();
    const modernIcon = fixture.nativeElement.querySelector(
      'sky-dropdown-button sky-icon i'
    );
    expect(modernIcon).toHaveCssClass('sky-i-sort');
  });
});
