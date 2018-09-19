import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { SkyChevronComponent } from './chevron.component';
import { SkyChevronModule } from './chevron.module';

import {
  SkyAppTestModule
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  expect
} from '@skyux-sdk/testing';

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

  function validateDirection(expectedDirection: string) {
    let el = fixture.nativeElement;
    let chevronEl = el.querySelector('.sky-chevron');

    fixture.detectChanges();

    expect(fixture.componentInstance.direction).toBe(expectedDirection);
    expect(chevronEl.classList.contains('sky-chevron-' + expectedDirection)).toBe(true);
  }

  function clickChevron(el: any) {
    el.querySelector('.sky-chevron').click();
  }

  it('should change direction when the user clicks the chevron', () => {
    let cmp = fixture.componentInstance as SkyChevronComponent;
    let el = fixture.nativeElement;

    fixture.detectChanges();

    validateDirection('up');

    cmp.directionChange.subscribe((direction: string) => {
      validateDirection('down');
    });

    clickChevron(el);
  });

  it('should not be able to click disabled chevron', () => {
    let el = fixture.nativeElement;

    // make disabled
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
