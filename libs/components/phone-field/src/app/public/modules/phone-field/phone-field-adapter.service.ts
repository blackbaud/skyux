import {
  Injectable,
  OnDestroy,
  Renderer2
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

@Injectable()
export class SkyPhoneFieldAdapterService implements OnDestroy {

  private ngUnsubscribe = new Subject();

  constructor(
    private renderer: Renderer2,
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public addElementClass(element: HTMLElement, className: string): void {
    this.renderer.addClass(element, className);
  }

  public setElementDisabledState(element: HTMLElement, disabled: boolean): void {
    this.renderer.setProperty(
      element,
      'disabled',
      disabled
    );
  }

  public setElementPlaceholder(element: HTMLElement, placeholder: string): void {
    this.renderer.setAttribute(element, 'placeholder', placeholder);
  }

  public setElementValue(element: HTMLElement, value: string): void {
    if (value) {
      this.renderer.setProperty(
        element,
        'value',
        value
      );
    }
  }

  public setAriaLabel(element: HTMLElement): void {
    if (!element.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_phone_field_default_label')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((value: string) => {
          this.renderer.setAttribute(
            element,
            'aria-label',
            value
          );
        });
    }
  }

}
