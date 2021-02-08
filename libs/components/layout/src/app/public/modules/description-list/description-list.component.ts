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
  ViewChild
} from '@angular/core';

import {
  takeUntil
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkyDescriptionListMode
} from './types/description-list-mode';

import {
  SkyDescriptionListAdapterService
} from './description-list-adapter-service';

import {
  SkyDescriptionListContentComponent
} from './description-list-content.component';

import {
  SkyDescriptionListService
} from './description-list.service';

/**
 * Creates a description list to display term-description pairs.
 */
@Component({
  selector: 'sky-description-list',
  templateUrl: './description-list.component.html',
  styleUrls: ['./description-list.component.scss'],
  providers: [SkyDescriptionListService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDescriptionListComponent implements AfterContentInit, OnDestroy {

/**
 * Specifies a default description to display when no description is provided
 * for a term-description pair.
 * @default 'None found'
 */
  @Input()
  public set defaultDescription(value: string) {
    this.descriptionListService.updateDefaultDescription(value);
  }

  /**
   * Specifies the width of term-description pairs when `mode` is set to `horizontal`. By default,
   * the width is responsive based on the width of the container element.
   */
  @Input()
  public listItemWidth: string;

  /**
   * Specifies how to display term-description pairs within the description list.
   * @default SkyDescriptionListMode.vertical
   */
  @Input()
  public set mode(value: SkyDescriptionListMode) {
    this._mode = value;
  }

  public get mode(): SkyDescriptionListMode {
    return this._mode || SkyDescriptionListMode.vertical;
  }

  @ContentChildren(SkyDescriptionListContentComponent)
  public contentComponents: QueryList<SkyDescriptionListContentComponent>;

  @ViewChild('descriptionListElement', {
    read: ElementRef,
    static: true
  })
  private elementRef: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  private _mode: SkyDescriptionListMode;

  constructor(
    private adapterService: SkyDescriptionListAdapterService,
    private changeDetector: ChangeDetectorRef,
    private descriptionListService: SkyDescriptionListService
  ) { }

  public ngAfterContentInit(): void {

    // Wait for all content to render before detecting parent width.
    setTimeout(() => {
      this.updateResponsiveClass();
    });

    this.contentComponents.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateResponsiveClass();
  }

  private updateResponsiveClass(): void {
    this.adapterService.setResponsiveClass(this.elementRef);
    this.changeDetector.markForCheck();
  }
}
