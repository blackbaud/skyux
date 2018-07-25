import {
  ReflectiveInjector
} from '@angular/core';

import {
  BaseRequestOptions,
  ConnectionBackend,
  RequestOptions,
  Response,
  ResponseOptions
} from '@angular/http';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import {
  BBAuth
} from '@blackbaud/auth-client';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParams
} from '@blackbaud/skyux-builder/runtime';

import {
  SkyAuthHttp
} from './auth-http';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

describe('SkyAuthHttp', () => {

  let skyAuthHttp: SkyAuthHttp;
  let lastConnection: MockConnection;

  function setupInjector(url: string): void {
    const injector = ReflectiveInjector.resolveAndCreate([
      SkyAuthTokenProvider,
      SkyAuthHttp,
      {
        provide: ConnectionBackend,
        useClass: MockBackend
      },
      {
        provide: RequestOptions,
        useClass: BaseRequestOptions
      },
      {
        provide: SkyAppConfig,
        useValue: {
          runtime: {
            params: new SkyAppRuntimeConfigParams(url, {
              'envid': true,
              'leid': true,
              'svcid': true
            })
          }
        }
      }
    ]);

    skyAuthHttp = injector.get(SkyAuthHttp);
    const backend = injector.get(ConnectionBackend) as MockBackend;

    backend.connections.subscribe((connection: MockConnection) => {
      lastConnection = connection;
      connection.mockRespond(new Response(new ResponseOptions({})));
    });
  }

  it('should call BBAuth.getToken and add token as header', (done) => {
    const token = 'my-fake-token';
    const getTokenSpy = spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve(token));

    setupInjector('');
    skyAuthHttp.get('my-bff-url.com').subscribe(() => {
      expect(lastConnection.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
      expect(getTokenSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should include envid if it is in the current url', (done) => {
    const search = '?envid=1234';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).toContain(search);
      done();
    });
  });

  it('should include svcid if it is in the current url', (done) => {
    const search = '?svcid=1234';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).toContain(search);
      done();
    });
  });

  it('should include leid if it is in the current url', (done) => {
    const search = '?leid=1234';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).toContain(search);
      done();
    });
  });

  it('should include envid and svcid if they are in the current url', (done) => {
    const search = '?envid=1234&svcid=5678';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).toContain(search);
      done();
    });
  });

  it('should include envid, svcid, and leid if they are in the current url', (done) => {
    const search = '?envid=123&svcid=456&leid=789';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).toContain(search);
      done();
    });
  });

  it('should not pass through unknown query params', (done) => {
    const search = '?junk=asdf';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector(search);
    skyAuthHttp.get('example.com').subscribe(() => {
      expect(lastConnection.request.url).not.toContain(search);
      done();
    });
  });

  it('should handle a requested url with a querystring', (done) => {
    const url = 'example.com?custom=true';
    const search = 'envid=asdf';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector('?' + search);
    skyAuthHttp.get(url).subscribe(() => {
      expect(lastConnection.request.url).toEqual(url + '&' + search);
      done();
    });
  });

  it('should handle being passed a url string (instead of Request)', (done) => {
    const url = 'url-as-string.com';
    spyOn(BBAuth, 'getToken').and.returnValue(Promise.resolve());

    setupInjector('');
    skyAuthHttp.request(url).subscribe(() => {
      expect(lastConnection.request.url).toEqual(url);
      done();
    });
  });

  /**
   * PLEASE NOTE
   * If this tests fails, it means you've changed the required parameters to the constructor.
   * To successfully maintain backwards compatibility:
   *  - make any new parameters optional
   *  - add any new parameters to the end of the constructor
   */
  it('should maintain backwards compatibility if new parameters added to the constructor', () => {
    setupInjector('');
    expect(skyAuthHttp).toBeDefined();
  });

  it('should request a token with the specified permission scope', () => {
    const search = '?envid=1234';
    const getTokenSpy = spyOn(BBAuth, 'getToken');

    setupInjector(search);
    skyAuthHttp
      .withScope('abc')
      .get('example.com');

    expect(getTokenSpy).toHaveBeenCalledWith({
      envId: '1234',
      permissionScope: 'abc'
    });
  });

  it('should include the envId regardless of permission scope', () => {
    const search = '?envid=1234';
    const getTokenSpy = spyOn(BBAuth, 'getToken');

    setupInjector(search);
    skyAuthHttp.get('example.com');

    expect(getTokenSpy).toHaveBeenCalledWith({
      envId: '1234'
    });
  });

  it('should not include the envId if undefined', () => {
    const getTokenSpy = spyOn(BBAuth, 'getToken');

    setupInjector('');
    skyAuthHttp.get('example.com');

    expect(getTokenSpy).toHaveBeenCalledWith({});
  });

});
