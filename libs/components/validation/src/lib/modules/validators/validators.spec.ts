import { UntypedFormControl } from '@angular/forms';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';

import { SkyValidators } from './validators';

describe('FormControl Validators', () => {
  describe('Email', () => {
    it('should be valid on empty input (empty string)', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined)', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null)', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue('first.last@blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on incorrect input', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue('[]abcdefgh0293abcd');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on incorrect input with multiple @s', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue('joe@abc.com@abc.com');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input', () => {
      const control = new UntypedFormControl('', SkyValidators.email);
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });

  describe('Url', () => {
    it('should be valid on empty input (empty string)', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined)', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null)', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      control.setValue('https://blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on text that is not a url', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      control.setValue('[]abcdefgh0293abcd]');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input', () => {
      const control = new UntypedFormControl('', SkyValidators.url);
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });
  describe('URL - ruleset v1 (explicit)', () => {
    const optionsRulesetV1: SkyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    it('should be valid on empty input (empty string) using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined) using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null) using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue('https://blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on text that is not a url using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue('[]abcdefgh0293abcd]');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input using ruleset v1 (explicitly)', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });

  describe('URL - ruleset v2', () => {
    const optionsRulesetV2: SkyUrlValidationOptions = {
      rulesetVersion: 2,
    };
    it('should be valid on empty input (empty string) using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (undefined) using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      control.setValue(undefined);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on empty input (null) using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      control.setValue(null);
      expect(control.valid).toBeTruthy();
    });

    it('should be valid on correct input using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      control.setValue('https://blackbaud.com');
      expect(control.valid).toBeTruthy();
    });

    it('should be invalid on text that is not a url using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      control.setValue('[]abcdefgh0293abcd]');
      expect(control.valid).toBeFalsy();
    });

    it('should be invalid on number input using ruleset v2', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV2),
      );
      control.setValue(123);
      expect(control.valid).toBeFalsy();
    });
  });

  describe('URL - none-onceability', () => {
    const optionsRulesetV1: SkyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    const optionsRulesetV2: SkyUrlValidationOptions = {
      rulesetVersion: 2,
    };

    it('should change validation rules asynchronously/reactively', () => {
      const control = new UntypedFormControl(
        '',
        SkyValidators.url(optionsRulesetV1),
      );
      control.setValue('sub.domain,com/pagename');
      expect(control.valid).toBeTruthy();
      control.clearValidators();
      control.addValidators(SkyValidators.url(optionsRulesetV2)!);
      control.updateValueAndValidity();
      expect(control.valid).toBeFalsy();
    });
  });
});
