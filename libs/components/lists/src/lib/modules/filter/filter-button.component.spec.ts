import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFilterModule } from './filter.module';
import { FilterButtonTestComponent } from './fixtures/filter-button.component.fixture';

describe('Filter button', () => {
  let contentInfoProvider: SkyContentInfoProvider;
  let fixture: ComponentFixture<FilterButtonTestComponent>;
  let nativeElement: HTMLElement;
  let component: FilterButtonTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterButtonTestComponent],
      imports: [SkyFilterModule, SkyThemeModule],
      providers: [SkyContentInfoProvider],
    });

    fixture = TestBed.createComponent(FilterButtonTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    fixture.detectChanges();

    contentInfoProvider = TestBed.inject(SkyContentInfoProvider);
  });

  function getButtonEl(): HTMLButtonElement {
    return nativeElement.querySelector('.sky-btn') as HTMLButtonElement;
  }

  function verifyTextPresent(): void {
    expect(getButtonEl().innerText.trim()).toBe('Filter');
  }

  function verifyTextNotPresent(): void {
    expect(getButtonEl().innerText.trim()).not.toBe('Filter');
  }

  it('should allow setting active state', () => {
    component.filtersActive = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.sky-btn')).toHaveCssClass(
      'sky-filter-btn-active',
    );
  });

  it('should allow setting id', () => {
    component.buttonId = 'i-am-an-id-look-at-me';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.sky-btn')?.id).toBe(
      'i-am-an-id-look-at-me',
    );
  });

  it('should allow setting aria properties', () => {
    component.ariaControls = 'filter-zone-2';
    component.ariaExpanded = true;
    component.ariaLabel = 'Test label';
    fixture.detectChanges();

    const button = nativeElement.querySelector('.sky-btn');
    expect(button?.getAttribute('aria-controls')).toBe('filter-zone-2');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.getAttribute('aria-label')).toBe('Test label');
  });

  it('should use the content info provider for aria label when applicable', () => {
    contentInfoProvider.patchInfo({
      descriptor: { value: 'constituents', type: 'text' },
    });
    fixture.detectChanges();

    const button = nativeElement.querySelector('.sky-btn');
    expect(button?.getAttribute('aria-label')).toBe('Filter constituents');
  });

  it('should not use the default input provider for aria label when overwritten', () => {
    contentInfoProvider.patchInfo({
      descriptor: { value: 'constituents', type: 'text' },
    });
    component.ariaLabel = 'Overwritten label';
    fixture.detectChanges();

    const button = nativeElement.querySelector('.sky-btn');
    expect(button?.getAttribute('aria-label')).toBe('Overwritten label');
  });

  it('should set a default aria label when the ariaLabel property is not given', () => {
    fixture.detectChanges();

    const button = nativeElement.querySelector('.sky-btn');
    expect(button?.getAttribute('aria-label')).toBe('Filter');
  });

  it('should emit event on click', () => {
    const buttonEl = getButtonEl();
    buttonEl.click();
    fixture.detectChanges();
    expect(component.buttonClicked).toBe(true);
  });

  it('should show button text', () => {
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
});
