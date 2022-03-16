import {
  auditTime,
  skip,
  take
} from 'rxjs/operators';

import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

describe('SkyRestrictedViewAuthService', () => {
  let authService: SkyRestrictedViewAuthService;
  let mockAuthTokenProvider: any;

  beforeEach(() => {
    // NOTE: We are ensuring here that no cookies carry over from one test to the other.
    localStorage.clear();
  });

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
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
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
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    });
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
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    });
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
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    });
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

  it('should set a cookie when a Blackbaud employee logs in', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    spyOn(Storage.prototype, 'setItem').and.callThrough();
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(Storage.prototype.setItem).toHaveBeenCalledWith('bb_has_logged_in_as_employee', '1');
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was previously authenticated once that is true', (done) => {
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
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(authService.hasBeenAuthenticated).toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was not previously authenticated if they have not been', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 2
        });
      }
    };
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        expect(authService.isAuthenticated.getValue()).not.toBeTruthy();
        expect(authService.hasBeenAuthenticated).not.toBeTruthy();
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was not previously authenticated if the cookie has been cleared', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    spyOn(Storage.prototype, 'removeItem').and.callThrough();
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(authService.hasBeenAuthenticated).toBeTruthy();
          expect(Storage.prototype.removeItem).not.toHaveBeenCalled();

          authService.clearHasBeenAuthenticated();
          expect(authService.hasBeenAuthenticated).not.toBeTruthy();
          expect(Storage.prototype.removeItem).toHaveBeenCalledWith('bb_has_logged_in_as_employee');
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was not previously authenticated if localstorage is not available to set the cookie', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    spyOn(Storage.prototype, 'setItem').and.throwError('Test error');
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(authService.hasBeenAuthenticated).not.toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was not previously authenticated if localstorage is not available to retrieve the cookie', (done) => {
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    spyOn(Storage.prototype, 'getItem').and.throwError('Test error');
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(authService.hasBeenAuthenticated).not.toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });

  it('should return that a user was previously authenticated if localstorage is not available to clear a cookie', (done) => {
    // NOTE: This case should not happen in the real world but we need to test that our try/catch
    // is operating correctly in the case where localstorage errors.
    mockAuthTokenProvider = {
      getDecodedToken(args: any) {
        return Promise.resolve({
          '1bb.perms': 1
        });
      }
    };
    spyOn(Storage.prototype, 'removeItem').and.throwError('Test error');
    authService = new SkyRestrictedViewAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getDecodedToken').and.callThrough();
    authService.isAuthenticated.pipe(skip(1), auditTime(200), take(1)).subscribe(next => {
      if (next !== undefined) {
        if (next === true) {
          expect(authService.isAuthenticated.getValue()).toBeTruthy();
          expect(authService.hasBeenAuthenticated).toBeTruthy();

          authService.clearHasBeenAuthenticated();
          expect(authService.hasBeenAuthenticated).toBeTruthy();
        }
      } else {
        fail('Subscription failed');
      }
      done();
    });
  });
});
