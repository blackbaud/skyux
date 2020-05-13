import {
  expect
} from '@skyux-sdk/testing';

import {
  parseAffixHorizontalAlignment
} from './dropdown-extensions';

describe('Dropdown extensions', function () {

  it('should parse affix types', () => {
    let result = parseAffixHorizontalAlignment('center');
    expect(result).toEqual('center');
    result = parseAffixHorizontalAlignment('left');
    expect(result).toEqual('left');
    result = parseAffixHorizontalAlignment('right');
    expect(result).toEqual('right');

    expect(() => {
      parseAffixHorizontalAlignment('foobar' as any);
    }).toThrow('SkyAffixHorizontalAlignment does not have a matching value for \'foobar\'!');
  });

});
