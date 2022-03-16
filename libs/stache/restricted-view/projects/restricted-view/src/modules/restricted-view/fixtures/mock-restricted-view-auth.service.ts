import {
  BehaviorSubject
} from 'rxjs';

export class MockSkyRestrictedViewAuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(undefined);
  public hasBeenAuthenticated: boolean = false;

  public clearHasBeenAuthenticated(): void {
    this.hasBeenAuthenticated = false;
  }
}
