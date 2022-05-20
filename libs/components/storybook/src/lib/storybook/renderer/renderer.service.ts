import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class RendererService {
  addClass(el: Element | ElementRef, name: string): void {
    let hostEl: Element;
    if (el instanceof ElementRef) {
      hostEl = el.nativeElement;
    } else {
      hostEl = el;
    }
    hostEl.classList.add(name);
  }

  removeClass(el: Element | ElementRef, name: string): void {
    let hostEl: Element;
    if (el instanceof ElementRef) {
      hostEl = el.nativeElement;
    } else {
      hostEl = el;
    }
    hostEl.classList.remove(name);
  }
}
