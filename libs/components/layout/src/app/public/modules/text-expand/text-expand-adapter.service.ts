import {
  ElementRef,
  Injectable,
  Renderer
} from '@angular/core';

@Injectable()
export class SkyTextExpandAdapterService {

  constructor(private renderer: Renderer) { }

  public getContainerHeight(containerEl: ElementRef) {
    return containerEl.nativeElement.offsetHeight;
  }

  public setContainerHeight(containerEl: ElementRef, height: string) {
    this.renderer.setElementStyle(containerEl.nativeElement, 'max-height', height);
  }

  public setText(textEl: ElementRef, text: string) {
    textEl.nativeElement.textContent = text;
  }
}
