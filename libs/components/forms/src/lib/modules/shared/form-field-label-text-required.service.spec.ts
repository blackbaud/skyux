import { SkyFormFieldLabelTextRequiredService } from './form-field-label-text-required.service';

describe('SkyFormFieldLabelTextRequiredService', () => {
  it('should throw an error if labelText is undefined', () => {
    const labelTextRequiredSvc = new SkyFormFieldLabelTextRequiredService();

    expect(() =>
      labelTextRequiredSvc.validateLabelText(undefined),
    ).toThrowError(
      'All form fields within <sky-field-group> must have `labelText` set on initialization.',
    );
  });
});
