import { SkyAppOmnibarProvider } from './omnibar-provider';
import { SkyAppOmnibarReadyArgs } from './omnibar-ready-args';

class MockOmnibarProvider extends SkyAppOmnibarProvider {
  public ready(): Promise<SkyAppOmnibarReadyArgs> {
    return Promise.resolve({
      envId: 'foo',
      svcId: 'bar',
    });
  }
}

describe('Omnibar provider', () => {
  it('should expose a ready method', async () => {
    const provider = new MockOmnibarProvider();
    const result = await provider.ready();
    expect(result).toEqual({
      envId: 'foo',
      svcId: 'bar',
    });
  });
});
