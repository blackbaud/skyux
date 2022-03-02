import { take } from 'rxjs/operators';

import { SkyAppResourceNameProvider } from './resource-name-provider';

describe('Resource name provider', () => {
  it('should return the input resouce name', (done) => {
    const provider = new SkyAppResourceNameProvider();
    const exampleResourceName = 'test-resource-name';
    provider
      .getResourceName(exampleResourceName)
      .pipe(take(1))
      .subscribe((name) => {
        expect(name).toEqual(exampleResourceName);
        done();
      });
  });
});
