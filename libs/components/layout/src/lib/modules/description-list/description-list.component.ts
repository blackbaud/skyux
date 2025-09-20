import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
} from '@angular/core';

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
  implements AfterContentInit, OnDestroy
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
    | QueryList<SkyDescriptionListContentComponent>
    | undefined;

  @ViewChild('descriptionListElement', {
    read: ElementRef,
    static: true,
  })
  public elementRef: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();
  #_mode: SkyDescriptionListModeType = 'vertical';

  #adapterService: SkyDescriptionListAdapterService;
  #changeDetector: ChangeDetectorRef;
  #descriptionListService: SkyDescriptionListService;

  constructor(
    adapterService: SkyDescriptionListAdapterService,
    changeDetector: ChangeDetectorRef,
    descriptionListService: SkyDescriptionListService,
  ) {
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;
    this.#descriptionListService = descriptionListService;
  }

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

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.#updateResponsiveClass();
  }

  #updateResponsiveClass(): void {
    if (this.elementRef) {
      this.#adapterService.setResponsiveClass(this.elementRef);
      this.#changeDetector.markForCheck();
    }
  }
}
