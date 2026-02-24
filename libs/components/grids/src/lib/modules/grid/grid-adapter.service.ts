import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { SkyGridColumnModel } from './grid-column.model';

/**
 * @internal
 */
@Injectable()
export class SkyGridAdapterService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Determines whether a column can be dropped at the given position.
   * Columns cannot be dropped to the left of locked columns.
   */
  public canDrop(
    displayedColumns: SkyGridColumnModel[],
    currentIndex: number,
    targetIndex: number,
  ): boolean {
    if (displayedColumns[currentIndex]?.locked) {
      return false;
    }

    // Cannot drop to the left of a locked column.
    if (targetIndex < currentIndex) {
      for (let i = targetIndex; i < currentIndex; i++) {
        if (displayedColumns[i]?.locked) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Handles the CDK drop event and returns the updated column IDs.
   */
  public onColumnDrop(
    event: CdkDragDrop<SkyGridColumnModel[]>,
    displayedColumns: SkyGridColumnModel[],
  ): string[] | undefined {
    if (event.previousIndex === event.currentIndex) {
      return undefined;
    }

    if (
      !this.canDrop(displayedColumns, event.previousIndex, event.currentIndex)
    ) {
      return undefined;
    }

    const columnIds = displayedColumns.map((col) => col.id);
    moveItemInArray(columnIds, event.previousIndex, event.currentIndex);

    return columnIds;
  }

  public getRowHeight(el: ElementRef, index: number): string {
    return (
      el.nativeElement.querySelectorAll('tbody tr')[index].scrollHeight + 'px'
    );
  }

  public setStyle(el: ElementRef, style: string, value: string): void {
    if (el) {
      this.renderer.setStyle(el.nativeElement, style, value);
    }
  }
}
