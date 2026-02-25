import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTextExpandRepeaterAdapterService {
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public getItems(elRef: ElementRef): NodeListOf<HTMLElement> {
    return (elRef.nativeElement as HTMLElement).querySelectorAll(
      '.sky-text-expand-repeater-item',
    ) as NodeListOf<HTMLElement>;
  }

  public hideItem(item: HTMLElement): void {
    this.#renderer.setStyle(item, 'display', 'none');
  }

  public showItem(item: HTMLElement): void {
    this.#renderer.removeStyle(item, 'display');
  }

  public getContainerHeight(containerEl: ElementRef): number {
    return containerEl.nativeElement.offsetHeight;
  }

  public getContainerScrollHeight(containerEl: ElementRef): number {
    return containerEl.nativeElement.scrollHeight;
  }

  public setContainerMaxHeight(containerEl: ElementRef, height: number): void {
    this.#renderer.setStyle(
      containerEl.nativeElement,
      'max-height',
      `${height}px`,
    );
  }

  public removeContainerMaxHeight(containerEl: ElementRef): void {
    this.#renderer.removeStyle(containerEl.nativeElement, 'max-height');
  }
}
