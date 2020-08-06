import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  SkyBrowserDetector
} from './browser-detector';

@Directive({
  selector: '[skyAutofill]'
})
export class SkyAutofillDirective implements OnInit {

  /**
   * Specifies what permission the browser has to provide automated assistance
   * in filling out form field values, as well as guidance as to the
   * type of information expected in the field. For a list of suggested values,
   * refer to [the W3C](https://www.w3.org/TR/html52/sec-forms.html#sec-autofill).
   * The `skyAutofill` directive will attempt to assist with the inconsistencies between browsers
   * when handling the "off" value, by providing different values based on the user agent.
   * @required
   */
  @Input()
  public set skyAutofill(value: string) {
    this._autofill = value;
    this.setAutocomplete();
  }

  public get skyAutofill(): string {
    return this._autofill;
  }

  private _autofill: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Implementation for Angular's OnInit lifecycle hook.
   * @internal
   */
  public ngOnInit(): void {
    this.setAutocomplete();
  }

  private setAutocomplete(): void {
    switch (this.skyAutofill) {
      case 'off':
        let value: string;
        if (SkyBrowserDetector.isChromeDesktop) {
          const name = this.elementRef.nativeElement.getAttribute('name') || 'sky-input';
          value = `new-${name}`;
        } else {
          value = 'off';
        }
        this.renderer.setAttribute(this.elementRef.nativeElement, 'autocomplete', value);
        break;

      case undefined:
      case '':
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'autocomplete');
        break;

      default:
        this.renderer.setAttribute(this.elementRef.nativeElement, 'autocomplete', this.skyAutofill);
    }
  }
}
