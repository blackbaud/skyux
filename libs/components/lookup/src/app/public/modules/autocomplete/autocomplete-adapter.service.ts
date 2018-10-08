import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import {
  SkyWindowRefService
} from '@skyux/core';

@Injectable()
export class SkyAutocompleteAdapterService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyWindowRefService
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public watchDropdownWidth(elementRef: ElementRef): void {
    Observable
      .fromEvent(this.windowRef.getWindow(), 'resize')
      .subscribe(() => {
        this.setDropdownWidth(elementRef);
      });

    this.windowRef.getWindow().setTimeout(() => {
      this.setDropdownWidth(elementRef);
    });
  }

  private setDropdownWidth(elementRef: ElementRef): void {
    const dropdownContainer = elementRef.nativeElement.querySelector('.sky-popover-container');
    const width = elementRef.nativeElement.getBoundingClientRect().width;
    this.renderer.setStyle(dropdownContainer, 'width', `${width}px`);
  }
}
