import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyThemeService } from '@skyux/theme';
import { SkyChevronModule } from '../chevron/chevron.module';
import { SkyExpansionIndicatorComponent } from './expansion-indicator.component';

describe('Expansion indicator component', () => {
  let fixture: ComponentFixture<SkyExpansionIndicatorComponent>;

  //#region helpers
  function getIndicatorEl(): HTMLElement {
    return fixture.nativeElement.querySelector('.sky-expansion-indicator');
  }
  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChevronModule],
      providers: [SkyThemeService],
    });

    fixture = TestBed.createComponent(SkyExpansionIndicatorComponent);
    fixture.detectChanges();
  });

  it('should change CSS class name when direction input value changes', () => {
    const indicatorEl = getIndicatorEl();

    expect(indicatorEl.classList).toContain('sky-expansion-indicator-up');
    expect(indicatorEl.classList).not.toContain('sky-expansion-indicator-down');

    fixture.componentInstance.direction = 'down';
    fixture.detectChanges();

    expect(indicatorEl.classList).toContain('sky-expansion-indicator-down');
    expect(indicatorEl.classList).not.toContain('sky-expansion-indicator-up');
  });

  it('should not be a focusable element', () => {
    const indicatorEl = getIndicatorEl();
    indicatorEl.focus();

    expect(document.activeElement).not.toEqual(indicatorEl);
  });

  it('should set aria-hidden to true', () => {
    const indicatorEl = getIndicatorEl();

    expect(indicatorEl.getAttribute('aria-hidden')).toBe('true');
  });

  it('should pass accessibility', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
