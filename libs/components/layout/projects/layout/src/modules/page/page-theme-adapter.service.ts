import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyPageThemeAdapterService {

  private styleEl: HTMLStyleElement;

  public addTheme(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.appendChild(document.createTextNode('body { background-color: #fff; }'));

      document.head.appendChild(this.styleEl);
    }
  }

  public removeTheme(): void {
    if (this.styleEl) {
      document.head.removeChild(this.styleEl);
      this.styleEl = undefined;
    }
  }

}
