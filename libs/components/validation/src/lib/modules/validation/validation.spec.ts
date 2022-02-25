import { SkyValidation } from './validation';

describe('Validation', () => {
  describe('Email validation', () => {
    it('should is correct input', () => {
      const isEmailValid = SkyValidation.isEmail('you@lostin.asia');
      expect(isEmailValid).toBeTruthy();
    });

    it('should is incorrect input', () => {
      const isEmailValid = SkyValidation.isEmail('[]awefhawenfc0293ejwf');
      expect(isEmailValid).toBeFalsy();
    });

    it('should is incorrect input with multiple @ symbols', () => {
      const isEmailValid = SkyValidation.isEmail('joe@abc.com@abc.com');
      expect(isEmailValid).toBeFalsy();
    });
  });

  describe('Url validation', () => {
    it('should is correct input', () => {
      const isUrlValid = SkyValidation.isUrl('https://blackbaud.com');
      expect(isUrlValid).toBeTruthy();
    });

    it('should is incorrect input', () => {
      const isUrlValid = SkyValidation.isUrl('[]awefhawenfc0293ejwf]');
      expect(isUrlValid).toBeFalsy();
    });
  });
});
