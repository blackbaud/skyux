import { waitForAsync } from '@angular/core/testing';

import { StacheAuthService } from './auth.service';

describe('Auth service', () => {
  it('should indicate the user is not authenticated', async () => {
    const authService = new StacheAuthService();
    const isAuthenticated = await authService.isAuthenticated.toPromise();

    expect(isAuthenticated).toBeFalse();
  });
});
