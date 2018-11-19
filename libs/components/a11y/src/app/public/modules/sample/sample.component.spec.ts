import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkySampleComponent
} from './sample.component';

describe('Sample', () => {
  let fixture: ComponentFixture<SkySampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkySampleComponent
      ]
    });

    fixture = TestBed.createComponent(SkySampleComponent);
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
