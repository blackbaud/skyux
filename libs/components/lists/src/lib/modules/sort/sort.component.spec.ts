import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect, expectAsync } from '@skyux-sdk/testing';

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
  let mockThemeSvc: Partial<SkyThemeService>;

  beforeEach(() => {
    mockThemeSvc = {
      setTheme(settings) {
        this.settingsChange.next({
          currentSettings: settings,
          previousSettings: this.currentSettings,
        });

        this.currentSettings = settings;
      },
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
      ],
    });

    fixture = TestBed.createComponent(SortTestComponent);
    component = fixture.componentInstance;
  });

  function getDropdownButtonEl(): HTMLElement {
    return document.querySelector('.sky-dropdown-button');
  }

  function getDropdownMenuEl(): HTMLElement {
    return document.querySelector('.sky-dropdown-menu');
  }

  function getSortItems(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.sky-sort-item');
  }

  function verifyTextPresent() {
    expect(getDropdownButtonEl().innerText.trim()).toBe('Sort');
  }

  function verifyTextNotPresent() {
    expect(getDropdownButtonEl().innerText.trim()).not.toBe('Sort');
  }

  it('creates a sort dropdown that respects active input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    let dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl).not.toBeNull();

    dropdownButtonEl.click();
    fixture.detectChanges();
    tick();

    let menuHeaderQuery = '.sky-sort-menu-heading';
    expect(document.querySelector(menuHeaderQuery)).toHaveText('Sort by');

    let itemsEl = getSortItems();
    expect(itemsEl.length).toBe(6);
    expect(itemsEl.item(2)).toHaveCssClass('sky-sort-item-selected');
    expect(itemsEl.item(2)).toHaveText('Date created (newest first)');
  }));

  it('creates a sort dropdown with the proper label and title', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    let dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl.getAttribute('aria-label')).toBe('Sort');
    expect(dropdownButtonEl.getAttribute('title')).toBe('Sort');

    dropdownButtonEl.click();
    fixture.detectChanges();
    tick();

    expect(getDropdownMenuEl().getAttribute('aria-labelledby')).toBe(
      document.querySelector('sky-sort-menu-heading').getAttribute('id')
    );
  }));

  it('changes active item on click and emits proper event', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    let dropdownButtonEl = getDropdownButtonEl();
    dropdownButtonEl.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    let itemsEl = getSortItems();
    let clickItem = itemsEl.item(1).querySelector('button') as HTMLElement;

    clickItem.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(component.sortedItem).toEqual({
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true,
    });

    dropdownButtonEl.click();

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
    button.click();
    fixture.detectChanges();
    tick();

    let itemsEl = getSortItems();
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

    mockThemeSvc.setTheme(
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light)
    );

    fixture.detectChanges();
    const modernIcon = fixture.nativeElement.querySelector(
      'sky-dropdown-button sky-icon i'
    );
    expect(modernIcon).toHaveCssClass('sky-i-sort');
  });
});
