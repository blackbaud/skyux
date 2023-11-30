import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyFilterModule } from './filter.module';
import { FilterInlineTestComponent } from './fixtures/filter-inline.component.fixture';

describe('Filter inline', () => {
  let fixture: ComponentFixture<FilterInlineTestComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterInlineTestComponent],
      imports: [SkyFilterModule],
    });

    fixture = TestBed.createComponent(FilterInlineTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should allow inline container and items', () => {
    expect(nativeElement.querySelector('.sky-filter-inline')).not.toBeNull();
    expect(
      nativeElement.querySelectorAll('.sky-filter-inline-item').length
    ).toBe(2);
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
