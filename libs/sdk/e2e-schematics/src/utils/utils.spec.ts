import { basename, capitalizeWords, dirname } from './utils';

describe('utils', () => {
  it('should capitalize words', () => {
    expect(capitalizeWords('one')).toEqual('One');
    expect(capitalizeWords('one-two')).toEqual('One Two');
    expect(capitalizeWords('one_two_three')).toEqual('One Two Three');
    expect(capitalizeWords('one two')).toEqual('One Two');
  });

  it('should basename', () => {
    expect(basename('one/two/three')).toEqual('three');
    expect(basename('one/two')).toEqual('two');
    expect(basename('one')).toEqual('one');
  });

  it('should dirname', () => {
    expect(dirname('one/two/three')).toEqual('one/two');
    expect(dirname('one/two')).toEqual('one');
    expect(dirname('one')).toEqual('');
  });
});
