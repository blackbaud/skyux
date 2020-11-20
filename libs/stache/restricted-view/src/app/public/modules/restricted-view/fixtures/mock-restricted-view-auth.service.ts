import {
  BehaviorSubject
} from 'rxjs';

export class MockSkyRestrictedViewAuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(true);
  public hasBeenAuthenticated: boolean = false;

  public clearHasBeenAuthenticated(): void {
    this.hasBeenAuthenticated = false;
  }
}
