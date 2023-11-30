import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyThemeService } from '@skyux/theme';

import { take } from 'rxjs/operators';

import { SkyChevronComponent } from './chevron.component';
import { SkyChevronModule } from './chevron.module';

describe('Chevron component', () => {
  let fixture: ComponentFixture<SkyChevronComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChevronModule],
      providers: [SkyThemeService],
    });

    fixture = TestBed.createComponent(SkyChevronComponent);
  });

  function getChevronEl(): HTMLElement {
    return fixture.nativeElement.querySelector('.sky-chevron');
  }

  function validateDirection(expectedDirection: string): void {
    const chevronEl = getChevronEl();

    fixture.detectChanges();

    expect(
      chevronEl.classList.contains('sky-chevron-' + expectedDirection)
    ).toBe(true);
  }

  function clickChevron(el: any): void {
    getChevronEl().click();
  }

  function keyChevron(keyName: string): void {
    SkyAppTestUtility.fireDomEvent(getChevronEl(), 'keydown', {
      keyboardEventInit: { key: keyName },
    });
  }

  it('should change direction when the user clicks the chevron', () => {
    const cmp = fixture.componentInstance as SkyChevronComponent;
    const el = fixture.nativeElement;

    fixture.detectChanges();
    validateDirection('up');

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('down');
    });

    clickChevron(el);

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('up');
    });

    clickChevron(el);
  });

  it('should change direction when the user activates the chevron with correct keyboard inputs', () => {
    const cmp = fixture.componentInstance as SkyChevronComponent;

    fixture.detectChanges();
    validateDirection('up');

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('down');
    });

    keyChevron(' ');

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('up');
    });

    keyChevron('enter');

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('down');
    });

    keyChevron('arrowUp');

    cmp.directionChange.pipe(take(1)).subscribe(() => {
      validateDirection('down');
    });
  });

  it('should handle an undefined direction being passed in', () => {
    const cmp = fixture.componentInstance as SkyChevronComponent;
    cmp.direction = undefined;

    fixture.detectChanges();
    validateDirection('up');
  });

  it('should not be able to click disabled chevron', () => {
    const el = fixture.nativeElement;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    validateDirection('up');
    clickChevron(el);

    fixture.detectChanges();
    validateDirection('up');
  });

  it('should set aria attributes', () => {
    const el = fixture.nativeElement;
    fixture.componentInstance.ariaControls = 'foo';
    fixture.componentInstance.ariaLabel = 'Users';
    fixture.componentInstance.direction = 'up';
    fixture.detectChanges();

    const buttonEl = el.querySelector('button');
    expect(buttonEl.getAttribute('aria-controls')).toBe('foo');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('true');
    expect(buttonEl.getAttribute('aria-label')).toBe('Users');
  });

  it('should set aria-expanded based on direction', () => {
    const el = fixture.nativeElement;
    fixture.componentInstance.direction = 'down';
    fixture.detectChanges();

    const buttonEl = el.querySelector('button');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('should pass accessibility', async () => {
    fixture.componentInstance.ariaLabel = 'Users';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
