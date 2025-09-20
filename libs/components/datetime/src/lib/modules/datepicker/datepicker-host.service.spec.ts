import { TestBed } from '@angular/core/testing';

import { SkyDatepickerHostService } from './datepicker-host.service';
import { SkyDatepickerComponent } from './datepicker.component';

describe('datepicker-host.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyDatepickerComponent],
      providers: [SkyDatepickerHostService],
    });
  });

  it('should throw an error if initialized more than once', () => {
    const svc = TestBed.inject(SkyDatepickerHostService);

    const datepicker = TestBed.createComponent(
      SkyDatepickerComponent,
    ).componentInstance;

    expect(() => svc.init(datepicker)).not.toThrow();

    expect(() => svc.init(datepicker)).toThrow(
      new Error('The datepicker host service is already initialized.'),
    );
  });
});
