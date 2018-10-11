import {
  ElementRef,
  Injectable,
  Renderer
} from '@angular/core';

@Injectable()
export class SkyTextExpandRepeaterAdapterService {

  constructor(private renderer: Renderer) { }

  public getItems(elRef: ElementRef) {
    return elRef.nativeElement.querySelectorAll('.sky-text-expand-repeater-item');
  }

  public hideItem(item: HTMLElement) {
    this.renderer.setElementStyle(item, 'display', 'none');
  }

  public showItem(item: HTMLElement) {
    this.renderer.setElementStyle(item, 'display', 'list-item');
  }

  public getContainerHeight(containerEl: ElementRef) {
    return containerEl.nativeElement.offsetHeight;
  }

  public setContainerHeight(containerEl: ElementRef, height: string) {
    this.renderer.setElementStyle(containerEl.nativeElement, 'max-height', height);
  }
}
