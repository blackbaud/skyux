import {
  TestBed
} from '@angular/core/testing';

import { SkyChevronComponent } from './chevron.component';
import { SkyChevronModule } from './chevron.module';

describe('Chevron component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyChevronModule
        ]
      });
    });

  function validateDirection(fixture: any, cmp: SkyChevronComponent, expectedDirection: string) {
    let el = fixture.nativeElement;
    let chevronEl = el.querySelector('.sky-chevron');

    fixture.detectChanges();

    expect(cmp.direction).toBe(expectedDirection);
    expect(chevronEl.classList.contains('sky-chevron-' + expectedDirection)).toBe(true);
  }

  function clickChevron(el: any) {
    el.querySelector('.sky-chevron').click();
  }

  it('should change direction when the user clicks the chevron', () => {
    let fixture = TestBed.createComponent(SkyChevronComponent);
    let cmp = fixture.componentInstance as SkyChevronComponent;
    let el = fixture.nativeElement;

    fixture.detectChanges();

    validateDirection(fixture, cmp, 'up');

    cmp.directionChange.subscribe((direction: string) => {
      validateDirection(fixture, cmp, 'down');
    });

    clickChevron(el);
  });

  it('should not be able to click disabled chevron', () => {
    let fixture = TestBed.createComponent(SkyChevronComponent);
    let cmp = fixture.componentInstance as SkyChevronComponent;
    let el = fixture.nativeElement;

    // make disabled
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    validateDirection(fixture, cmp, 'up');

    clickChevron(el);

    fixture.detectChanges();

    validateDirection(fixture, cmp, 'up');
  });
});
