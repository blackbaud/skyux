import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

describe('SkyRestrictedViewAuthService', () => {
  let authService: SkyRestrictedViewAuthService;
  let mockAuthTokenProvider: any;

  it('should authenticate when JWT contains 1bb.perms where 1bb.perms is a number', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    }).unsubscribe();
  });

  it('should authenticate when JWT contains 1bb.perms where 1bb.perms is not a number', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': '0'
        });
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    }).unsubscribe();
  });

  it('should not authenticate when JWT does not contain 1bb.perms', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve(true);
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.returnValue(Promise.resolve({})).and.callThrough();
    authService.isAuthenticated.subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    }).unsubscribe();
  });

  it('should not authenticate when JWT contains invalid 1bb.perms', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve(true);
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.returnValue(Promise.resolve({
      '1bb.perms': 'invalid'
    }) as any).and.callThrough();
    authService.isAuthenticated.subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    }).unsubscribe();
  });

  it('should not authenticate if call to get token fails', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.reject();
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    expect(authService.isAuthenticated.getValue).not.toHaveBeenCalled();
    done();
  });
});
