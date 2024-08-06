import { TestBed } from '@angular/core/testing';
import { SKY_LOG_LEVEL, SkyLogLevel } from '@skyux/core';

import { SkyFormFieldLabelTextRequiredService } from './form-field-label-text-required.service';

describe('SkyFormFieldLabelTextRequiredService', () => {
  let labelTextRequiredSvc: SkyFormFieldLabelTextRequiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyFormFieldLabelTextRequiredService,
        { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Error },
      ],
    });
    labelTextRequiredSvc = TestBed.inject(SkyFormFieldLabelTextRequiredService);
  });

  it('should throw an error if labelText is undefined', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    labelTextRequiredSvc.validateLabelText(undefined);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'All form fields within <sky-field-group> must have `labelText` set on initialization.',
    );
  });

  it('should not throw an error if labelText is null, such as an unresolved async pipe', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    labelTextRequiredSvc.validateLabelText(null);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
