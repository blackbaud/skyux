import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  expectAsync
} from '@skyux-sdk/testing';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  take
} from 'rxjs/operators';

import {
  SkyChevronComponent
} from './chevron.component';

import {
  SkyChevronModule
} from './chevron.module';

describe('Chevron component', () => {
  let fixture: ComponentFixture<SkyChevronComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyChevronModule
      ],
      providers: [
        SkyThemeService
      ]
    });

    fixture = TestBed.createComponent(SkyChevronComponent);
  });

  function validateDirection(expectedDirection: string): void {
    const el = fixture.nativeElement;
    const chevronEl = el.querySelector('.sky-chevron');

    fixture.detectChanges();

    expect(fixture.componentInstance.direction).toBe(expectedDirection);
    expect(chevronEl.classList.contains('sky-chevron-' + expectedDirection)).toBe(true);
  }

  function clickChevron(el: any): void {
    el.querySelector('.sky-chevron').click();
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

  it('should not be able to click disabled chevron', () => {
    const el = fixture.nativeElement;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    validateDirection('up');
    clickChevron(el);

    fixture.detectChanges();
    validateDirection('up');
  });

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
