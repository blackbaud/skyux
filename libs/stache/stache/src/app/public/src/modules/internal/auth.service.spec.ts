import { StacheAuthService } from './auth.service';

describe('StacheAuthService', () => {
  let authService: StacheAuthService;
  let mockAuthTokenProvider: any;

  it('should authenticate when isAuthenticated is false', () => {
    mockAuthTokenProvider = {
      getToken(args: any) {
        return Promise.resolve(true);
      }
    };
    authService = new StacheAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getToken').and.returnValue(Promise.resolve()).and.callThrough();
    authService.isAuthenticated.subscribe(next => {
      if (next) {
        expect(authService.isAuthenticated.getValue()).toBeTruthy();
      }
    });
  });

  it('should not authenticate', () => {
    mockAuthTokenProvider = {
      getToken(args: any) {
        return Promise.reject(false);
      }
    };
    authService = new StacheAuthService(mockAuthTokenProvider as any);
    spyOn(authService.isAuthenticated, 'getValue').and.callThrough();
    spyOn(authService['auth'], 'getToken').and.returnValue({res: undefined, err: {}}).and.callThrough();
    expect(authService.isAuthenticated.getValue).not.toHaveBeenCalled();
  });
});
