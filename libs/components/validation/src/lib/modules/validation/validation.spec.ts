import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';

import { SkyValidation } from './validation';

describe('Validation', () => {
  describe('Email validation', () => {
    it('should is correct input', () => {
      const isEmailValid = SkyValidation.isEmail('you@lostin.asia');
      expect(isEmailValid).toBeTruthy();
    });

    it('should is incorrect input', () => {
      const isEmailValid = SkyValidation.isEmail('[]abcdefgh0293abcd');
      expect(isEmailValid).toBeFalsy();
    });

    it('should is incorrect input with multiple @ symbols', () => {
      const isEmailValid = SkyValidation.isEmail('joe@abc.com@abc.com');
      expect(isEmailValid).toBeFalsy();
    });
  });

  describe('Url validation', () => {
    const optionsRulesetV1: SkyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    const optionsRulesetV2: SkyUrlValidationOptions = {
      rulesetVersion: 2,
    };

    it('should validate correct input in ruleset v1', () => {
      const isUrlValid = SkyValidation.isUrl('https://blackbaud.com');
      expect(isUrlValid).toBeTruthy();
    });

    it('should validate incorrect input in ruleset v1', () => {
      const isUrlValid = SkyValidation.isUrl('[]abcdefgh0293abcd]');
      expect(isUrlValid).toBeFalsy();
    });

    it('should validate correct input in ruleset v2', () => {
      const strings: string[] = [
        'http://test.test.com',
        'domain.com',
        'www.domain.com',
        'amanda.test.com/alumni',
        '1.1.1.1',
        'sub.domain.ly/here?i=am&you=are',
        'sub.domain.ly/here#anchor',
        'sub.domain#anchor',
        'sub.domain#anchor?query=here&here=now',
        "domain.ly?word&amp;$,.%25+'/\\",
        'sub.domain.ly//',
      ];
      strings.forEach((string) => {
        const isUrlValid = SkyValidation.isUrl(string, optionsRulesetV2);
        expect(isUrlValid)
          .withContext('expected "' + string + '" to be valid')
          .toBeTruthy();
      });
    });

    it('should validate incorrect input in ruleset v2', () => {
      const strings: string[] = [
        'sub.domain,com/pagename',
        'http://test.test,com',
        'www.test.com,com',
        'www.domain,com',
        'amanda..test.com/alum/here?i=am',
        'domain.#anchor',
        "domain.lieWord&amp;$,.%25+'/\\",
      ];
      strings.forEach((string) => {
        const isUrlValid = SkyValidation.isUrl(string, optionsRulesetV2);
        expect(isUrlValid)
          .withContext('expected "' + string + '" to be invalid')
          .toBeFalsy();
      });
    });

    it('should have more strict rules in ruleset v2 than it does in ruleset v1', () => {
      const strings: string[] = [
        'sub.domain,com/pagename',
        'http://test.test,com',
        'www.test.com,com',
        'www.domain,com',
        "domain.lieWord&amp;$,.%25+'/\\",
      ];

      strings.forEach((string) => {
        const isUrlValidInV1 = SkyValidation.isUrl(string, optionsRulesetV1);
        expect(isUrlValidInV1)
          .withContext('expected "' + string + '" to be valid in ruleset v1')
          .toBeTruthy();

        const isUrlValidInV2 = SkyValidation.isUrl(string, optionsRulesetV2);
        expect(isUrlValidInV2)
          .withContext('expected "' + string + '" to be invalid in ruleset v2')
          .toBeFalsy();
      });
    });
  });
});
