import {
  AfterContentInit,
  AfterViewInit,
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

import { MutationObserverService } from '@skyux/core';

import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

import { SkyDescriptionListModeType } from './types/description-list-mode-type';

import { SkyDescriptionListAdapterService } from './description-list-adapter-service';

import { SkyDescriptionListContentComponent } from './description-list-content.component';

import { SkyDescriptionListService } from './description-list.service';

/**
 * Creates a description list to display term-description pairs.
 */
@Component({
  selector: 'sky-description-list',
  templateUrl: './description-list.component.html',
  styleUrls: ['./description-list.component.scss'],
  providers: [SkyDescriptionListAdapterService, SkyDescriptionListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDescriptionListComponent
  implements AfterContentInit, AfterViewInit, OnDestroy
{
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
   * @default 'vertical'
   */
  @Input()
  public set mode(value: SkyDescriptionListModeType) {
    this._mode = value;
  }

  public get mode(): SkyDescriptionListModeType {
    return this._mode || 'vertical';
  }

  @ContentChildren(SkyDescriptionListContentComponent)
  public contentComponents: QueryList<SkyDescriptionListContentComponent>;

  private contentObserver: MutationObserver;

  @ViewChild('descriptionListElement', {
    read: ElementRef,
    static: true,
  })
  private elementRef: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  private _mode: SkyDescriptionListModeType;

  constructor(
    private adapterService: SkyDescriptionListAdapterService,
    private changeDetector: ChangeDetectorRef,
    private descriptionListService: SkyDescriptionListService,
    private mutationSvc: MutationObserverService
  ) {}

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

  public ngAfterViewInit(): void {
    this.contentObserver = this.mutationSvc.create(() => {
      this.changeDetector.markForCheck();
    });
    this.contentObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.contentObserver.disconnect();
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
