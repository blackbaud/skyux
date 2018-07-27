import { SkyAppFormat } from './format';

describe('SkyAppFormat', () => {

  it('should replace the templated string with the correct paramters', () => {
    const format = new SkyAppFormat();

    expect(format.formatText('This is the {0} test string. It {1}!', 'first', 'worked'))
      .toBe('This is the first test string. It worked!');
  });

});
