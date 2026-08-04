import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyResizeObserverService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDescriptionListAdapterService } from './description-list-adapter-service';
import { SkyDescriptionListContentComponent } from './description-list-content.component';
import { SkyDescriptionListService } from './description-list.service';
import { SkyDescriptionListModeType } from './types/description-list-mode-type';

/**
 * Creates a description list to display term-description pairs.
 */
@Component({
  selector: 'sky-description-list',
  templateUrl: './description-list.component.html',
  styleUrls: ['./description-list.component.scss'],
  providers: [SkyDescriptionListAdapterService, SkyDescriptionListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDescriptionListComponent
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /**
   * The default description to display when no description is provided
   * for a term-description pair.
   * @default "None found"
   */
  @Input()
  public set defaultDescription(value: string) {
    this.#descriptionListService.updateDefaultDescription(value);
  }

  /**
   * The width of term-description pairs when `mode` is set to `"horizontal"`. By default,
   * the width is responsive based on the width of the container element.
   */
  @Input()
  public listItemWidth: string | undefined;

  /**
   * How to display term-description pairs within the description list.
   * @default "vertical"
   */
  @Input()
  public set mode(value: SkyDescriptionListModeType | undefined) {
    this.#_mode = value || 'vertical';
  }

  public get mode(): SkyDescriptionListModeType {
    return this.#_mode;
  }

  @ContentChildren(SkyDescriptionListContentComponent)
  public contentComponents:
    QueryList<SkyDescriptionListContentComponent> | undefined;

  @ViewChild('descriptionListElement', {
    read: ElementRef,
    static: true,
  })
  public elementRef: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();
  #_mode: SkyDescriptionListModeType = 'vertical';

  readonly #adapterService = inject(SkyDescriptionListAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #descriptionListService = inject(SkyDescriptionListService);
  readonly #resizeObserverSvc = inject(SkyResizeObserverService);

  public ngAfterContentInit(): void {
    // Wait for all content to render before detecting parent width.
    setTimeout(() => {
      this.#updateResponsiveClass();
    });

    // istanbul ignore else
    if (this.contentComponents) {
      this.contentComponents.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#changeDetector.markForCheck();
        });
    }
  }

  public ngAfterViewInit(): void {
    // Recalculate the responsive class whenever the container size changes so
    // the layout stays correct for containers that are hidden (width 0) or
    // resized after the initial measurement, such as inactive tab content that
    // is later revealed — not just on window resize.
    if (this.elementRef) {
      this.#resizeObserverSvc
        .observe(this.elementRef)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateResponsiveClass();
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #updateResponsiveClass(): void {
    if (this.elementRef) {
      this.#adapterService.setResponsiveClass(this.elementRef);
      this.#changeDetector.markForCheck();
    }
  }
}
