import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { DragulaService } from 'ng2-dragula';

const GRID_HEADER_DRAGGING_CLASS = 'sky-grid-header-dragging';
const GRID_HEADER_LOCKED_SELECTOR = '.sky-grid-header-locked';
const GRID_HEADER_RESIZE_HANDLE = '.sky-grid-resize-handle';
const GRID_ROW_DELETE_SELECTOR = '.sky-grid-row-delete-heading';
const GRID_MULTISELECT_SELECTOR = '.sky-grid-multiselect-cell';

/**
 * @internal
 */
@Injectable()
export class SkyGridAdapterService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public initializeDragAndDrop(
    dragulaService: DragulaService,
    dropCallback: (newColumnIds: Array<string>) => void
  ) {
    dragulaService
      .drag('AHOY')
      .subscribe((args) => args.el.classList.add(GRID_HEADER_DRAGGING_CLASS));

    dragulaService
      .dragend('AHOY')
      .subscribe((args) =>
        args.el.classList.remove(GRID_HEADER_DRAGGING_CLASS)
      );

    dragulaService.drop('AHOY').subscribe((args) => {
      const columnIds: string[] = [];
      const nodes = args.el.querySelectorAll(
        `th:not(${GRID_MULTISELECT_SELECTOR}):not(${GRID_ROW_DELETE_SELECTOR})`
      );
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const id = el.getAttribute('sky-cmp-id');
        columnIds.push(id);
      }
      dropCallback(columnIds);
    });

    dragulaService.createGroup('sky-grid-heading', {
      moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
        const columns: NodeListOf<HTMLElement> =
          container.querySelectorAll('th div');
        const isLeftOfLocked = this.isLeftOfLocked(handle, columns);

        return (
          !el.querySelector(GRID_HEADER_LOCKED_SELECTOR) &&
          handle !== undefined &&
          !handle.matches(GRID_HEADER_RESIZE_HANDLE) &&
          !handle.matches(GRID_MULTISELECT_SELECTOR) &&
          !handle.matches(GRID_ROW_DELETE_SELECTOR) &&
          !isLeftOfLocked
        );
      },
      accepts: (
        el: HTMLElement,
        target: HTMLElement,
        source: HTMLElement,
        sibling: HTMLElement
      ) => {
        if (sibling === undefined || !sibling) {
          return true;
        }

        const columns: NodeListOf<HTMLElement> =
          source.querySelectorAll('th div');
        const siblingDiv = sibling.querySelector('div');
        const isLeftOfLocked = this.isLeftOfLocked(siblingDiv, columns);

        return (
          !sibling.matches(GRID_HEADER_LOCKED_SELECTOR) &&
          !sibling.matches(GRID_HEADER_RESIZE_HANDLE) &&
          !isLeftOfLocked
        );
      },
    });
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

  private isLeftOfLocked(
    handle: HTMLElement,
    columns: NodeListOf<HTMLElement>
  ): boolean {
    let sourceColumn = handle;
    for (const column of Array.from(columns)) {
      if (column.contains(handle)) {
        sourceColumn = column;
      }
    }

    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].classList.contains('sky-grid-header-locked')) {
        return true;
      }

      if (columns[i] === sourceColumn) {
        break;
      }
    }

    return false;
  }
}
