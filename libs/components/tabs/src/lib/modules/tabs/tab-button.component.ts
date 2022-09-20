import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyTabButtonAdapterService } from './tab-button-adapter.service';
import { SkyTabIndex } from './tab-index';
import { SkyTabsetStyle } from './tabset-style';
import { SkyTabsetService } from './tabset.service';

/**
 * @internal
 */
@Component({
  selector: 'sky-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
  providers: [SkyTabButtonAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkyTabButtonComponent implements AfterViewInit, OnDestroy {
  @Input()
  public active: boolean;

  @Input()
  public ariaControls: string;

  @Input()
  public buttonHref: string;

  @Input()
  public buttonId: string;

  @Input()
  public buttonText: string;

  @Input()
  public buttonTextCount: string | undefined;

  @Input()
  public closeable: boolean;

  @Input()
  public disabled: boolean;

  @Input()
  public tabIndex: SkyTabIndex;

  @Input()
  public get tabStyle(): SkyTabsetStyle {
    return this.#_tabStyle;
  }

  public set tabStyle(style: SkyTabsetStyle) {
    this.#_tabStyle = style;
    this.elementRole = style === 'tabs' ? 'tab' : undefined;
  }

  @Output()
  public buttonClick = new EventEmitter<void>();

  @Output()
  public closeClick = new EventEmitter<void>();

  constructor(
    elementRef: ElementRef,
    adapterService: SkyTabButtonAdapterService,
    changeDetectorRef: ChangeDetectorRef,
    tabsetService: SkyTabsetService
  ) {
    this.#adapterService = adapterService;
    this.#changeDetectorRef = changeDetectorRef;
    this.#elementRef = elementRef;
    this.#tabsetService = tabsetService;
  }

  public elementRole: string | undefined = 'tab';
  public closeBtnTabIndex = '-1';

  #_tabStyle: SkyTabsetStyle;
  #adapterService: SkyTabButtonAdapterService;
  #changeDetectorRef: ChangeDetectorRef;
  #elementRef: ElementRef;
  #tabsetService: SkyTabsetService;
  #ngUnsubscribe = new Subject<void>();

  public ngAfterViewInit(): void {
    this.#tabsetService.focusedTabBtnIndex
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((focusedIndex) => {
        if (focusedIndex === this.tabIndex) {
          this.closeBtnTabIndex = '0';
          this.focusBtn();
        } else {
          this.closeBtnTabIndex = '-1';
        }
        this.#changeDetectorRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onButtonClick(event: any): void {
    if (!this.disabled) {
      this.buttonClick.emit();
      event.preventDefault();
    }
  }

  public onTabButtonKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toUpperCase()) {
        case ' ':
        case 'ENTER':
          this.onButtonClick(event);
          break;
        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  public onCloseClick(event: any): void {
    this.closeClick.emit();

    // Prevent the click event from bubbling up to the anchor tag;
    // otherwise it will trigger a page refresh.
    event.stopPropagation();
    event.preventDefault();
  }

  public focusBtn(): void {
    this.#adapterService.focusButtonLink(this.#elementRef);
  }

  public onFocus(): void {
    this.#tabsetService.setFocusedTabBtnIndex(this.tabIndex);
  }
}
