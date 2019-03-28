import {
  Format
} from './format';

describe('Format', () => {
  it('should replace the templated string with the correct parameters', () => {
    const result = Format.formatText(
      'This is the {0} test string. It {1}!',
      'first',
      'worked'
    );

    expect(result).toBe('This is the first test string. It worked!');
  });
});
