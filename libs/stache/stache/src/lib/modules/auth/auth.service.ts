import { Injectable } from '@angular/core';

import { of } from 'rxjs';

@Injectable()
export class StacheAuthService {
  public readonly isAuthenticated = of<boolean>(false);
}
