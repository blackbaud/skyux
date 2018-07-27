import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyWindowRefService {
  public getWindow(): Window {
    return window;
  }
}
