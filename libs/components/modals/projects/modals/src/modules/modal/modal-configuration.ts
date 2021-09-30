import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable({
  providedIn: 'any'
})

export class SkyModalConfiguration {
  public fullPage?: boolean;
  public size?: string;
  public ariaDescribedBy?: string;
  public ariaLabelledBy?: string;
  public ariaRole?: string;
  public tiledBody?: boolean;
  public helpKey?: string;

  constructor() {
    this.fullPage = this.fullPage;
    this.size = 'medium';
  }
}
