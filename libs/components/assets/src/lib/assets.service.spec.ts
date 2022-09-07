import { SkyAppAssetsService } from './assets.service';

class MockAssetsService extends SkyAppAssetsService {
  #urls = { foo: 'https://foo.com' };

  public getUrl(path: string) {
    return (this.#urls as any)[path];
  }

  public getAllUrls() {
    return this.#urls;
  }
}

describe('Assets service', () => {
  it('should have expected methods', () => {
    const svc = new MockAssetsService();
    expect(svc.getAllUrls()).toEqual({ foo: 'https://foo.com' });
    expect(svc.getUrl('foo')).toEqual('https://foo.com');
  });
});
