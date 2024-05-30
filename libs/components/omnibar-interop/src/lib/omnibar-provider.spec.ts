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

class MockOmnibarProviderDisabled extends SkyAppOmnibarProvider {
  public ready(): Promise<SkyAppOmnibarReadyArgs> {
    return Promise.resolve({
      envId: 'foo',
      svcId: 'bar',
      disabled: true,
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
  it('should expose a ready method and be disabled', async () => {
    const provider = new MockOmnibarProviderDisabled();
    const result = await provider.ready();
    expect(result).toEqual({
      envId: 'foo',
      svcId: 'bar',
      disabled: true,
    });
  });
});
