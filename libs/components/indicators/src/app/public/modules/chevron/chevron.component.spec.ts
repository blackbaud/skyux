import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyAppTestModule
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  expect
} from '@skyux-sdk/testing';

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
        SkyAppTestModule,
        SkyChevronModule
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

    cmp.directionChange.subscribe(() => {
      validateDirection('down');
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

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
