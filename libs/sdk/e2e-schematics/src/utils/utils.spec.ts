import { capitalizeWords, dirname } from './utils';

describe('utils', () => {
  it('should capitalize words', () => {
    expect(capitalizeWords('one')).toEqual('One');
    expect(capitalizeWords('one-two')).toEqual('One Two');
    expect(capitalizeWords('one_two_three')).toEqual('One Two Three');
    expect(capitalizeWords('one two')).toEqual('One Two');
  });

  it('should dirname', () => {
    expect(dirname('one/two/three')).toEqual('one/two');
    expect(dirname('one/two')).toEqual('one');
    expect(dirname('one')).toEqual('');
  });
});
