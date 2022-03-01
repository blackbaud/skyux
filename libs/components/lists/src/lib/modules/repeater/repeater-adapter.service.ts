import { ElementRef, Injectable } from '@angular/core';

import { SkyRepeaterService } from './repeater.service';

/**
 * @internal
 */
@Injectable()
export class SkyRepeaterAdapterService {
  private get repeaterItemGroupSelector(): string {
    return '.sky-repeater-item-group-' + this.repeaterService.repeaterGroupId;
  }

  private host: ElementRef;

  constructor(private repeaterService: SkyRepeaterService) {}

  public focusElement(element: ElementRef | HTMLElement): void {
    if (element instanceof ElementRef) {
      element.nativeElement.focus();
    } else {
      element.focus();
    }
  }

  public setRepeaterHost(hostRef: ElementRef): void {
    this.host = hostRef;
  }

  public getRepeaterItemIndex(element: HTMLElement): number {
    return this.getRepeaterItemArray().indexOf(element);
  }

  public moveItemUp(element: HTMLElement, top = false, steps = 1): number {
    const index = this.getRepeaterItemIndex(element);

    if (index === 0) {
      return;
    }

    let newIndex = index - steps;

    if (top || newIndex < 0) {
      newIndex = 0;
    }

    return this.moveItem(element, index, newIndex);
  }

  public moveItemDown(element: HTMLElement, steps = 1): number {
    const itemArray = this.getRepeaterItemArray();
    const index = this.getRepeaterItemIndex(element);

    if (index === itemArray.length - steps) {
      return;
    }

    const newIndex = index + steps;

    return this.moveItem(element, index, newIndex);
  }

  private moveItem(
    element: HTMLElement,
    oldIndex: number,
    newIndex: number
  ): number {
    const repeaterDiv: HTMLElement =
      this.host.nativeElement.querySelector('.sky-repeater');

    repeaterDiv.removeChild(element);
    const nextSibling = repeaterDiv.querySelectorAll(
      this.repeaterItemGroupSelector
    )[newIndex];

    repeaterDiv.insertBefore(element, nextSibling);
    this.repeaterService.reorderItem(oldIndex, newIndex);

    return newIndex;
  }

  /**
   * Returns an array of the immediate repeater item descendants. Excludes nested repeater items.
   */
  private getRepeaterItemArray() {
    return Array.from(
      this.host.nativeElement.querySelectorAll(this.repeaterItemGroupSelector)
    );
  }
}
