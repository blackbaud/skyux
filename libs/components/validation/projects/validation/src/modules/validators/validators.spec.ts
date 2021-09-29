import {
  FormControl
} from '@angular/forms';

import {
  SkyValidators
} from './validators';

describe('Validators', () => {
  describe('Email', () => {
    it('should be valid on empty input (empty string)', () => {
      const control = new FormControl('', SkyValidators.email);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined)', () => {
      const control = new FormControl('', SkyValidators.email);
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null)', () => {
      const control = new FormControl('', SkyValidators.email);
      /* tslint:disable:no-null-keyword */
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input', () => {
      const control = new FormControl('', SkyValidators.email);
      control.setValue('first.last@blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on incorrect input', () => {
      const control = new FormControl('', SkyValidators.email);
      control.setValue('[]awefhawenfc0293ejwf');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on incorrect input with multiple @s', () => {
      const control = new FormControl('', SkyValidators.email);
      control.setValue('joe@abc.com@abc.com');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input', () => {
      const control = new FormControl('', SkyValidators.email);
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });

  describe('Url', () => {
    it('should be valid on empty input (empty string)', () => {
      const control = new FormControl('', SkyValidators.url);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined)', () => {
      const control = new FormControl('', SkyValidators.url);
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null)', () => {
      const control = new FormControl('', SkyValidators.url);
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input', () => {
      const control = new FormControl('', SkyValidators.url);
      control.setValue('https://blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on text that is not a url', () => {
      const control = new FormControl('', SkyValidators.url);
      control.setValue('[]awefhawenfc0293ejwf]');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input', () => {
      const control = new FormControl('', SkyValidators.url);
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });
});
