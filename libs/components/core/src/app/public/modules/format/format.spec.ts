import {
  SkyAppFormat
} from './format';

import { SkyFormat } from './format';

describe('Format', () => {
  describe('SkyAppFormat', () => {
    it('should replace the templated string with the correct paramters', () => {
      const format = new SkyAppFormat();
      expect(format.formatText('This is the {0} test string. It {1}!', 'first', 'worked'))
        .toBe('This is the first test string. It worked!');
    });
  });

  describe('Format class', () => {
    describe('formatText() method', () => {
      it('should return the expected strings', function () {
        const format = 'My name is {0}, {1}';
        const name = 'Jimithy';
        const greeting = 'hello';
        const result = SkyFormat.formatText(format, name, greeting);
        expect(result).toBe('My name is Jimithy, hello');

      });

      it('should return empty string when format is undefined', function () {
        const name = 'Jimithy';
        const greeting = 'hello';
        const result = SkyFormat.formatText(undefined, name, greeting);
        expect(result).toBe('');
      });
    });
  });
});
