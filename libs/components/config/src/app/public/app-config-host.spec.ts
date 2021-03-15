import {
  SkyAppConfigHost
} from './app-config-host';

describe('SkyAppConfigHost', () => {

  it('should set defaults', () => {
    const hostConfig = new SkyAppConfigHost();
    hostConfig.init();

    expect(hostConfig.host).toEqual({
      frameOptions: {
        none: true
      },
      url: 'https://host.nxt.blackbaud.com/'
    });
  });

  it('should merge args with defaults', () => {
    const hostConfig = new SkyAppConfigHost();
    hostConfig.init({
      url: 'https://app.blackbaud.com/',
      bbCheckout: {
        version: '2'
      }
    });

    expect(hostConfig.host).toEqual({
      frameOptions: {
        none: true
      },
      url: 'https://app.blackbaud.com/',
      bbCheckout: {
        version: '2'
      }
    });
  });

});
