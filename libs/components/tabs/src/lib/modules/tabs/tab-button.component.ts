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

const DEFAULT_DISABLED = false;

type SkyWizardStepState = 'completed' | 'current' | 'unavailable';

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
  standalone: false,
})
export class SkyTabButtonComponent implements AfterViewInit, OnDestroy {
  @Input()
  public get active(): boolean | undefined {
    return this.#_isActive;
  }
  public set active(value: boolean | undefined) {
    this.#_isActive = value;
    this.#updateWizardStepState();
  }

  @Input()
  public ariaControls: string | undefined;

  @Input()
  public buttonHref: string | undefined;

  @Input()
  public buttonId: string | undefined;

  @Input()
  public buttonText: string | undefined;

  @Input()
  public buttonTextCount: string | undefined;

  @Input()
  public closeable: boolean | undefined;

  @Input()
  public get disabled(): boolean {
    return this.#_isDisabled;
  }

  public set disabled(value: boolean | undefined) {
    this.#_isDisabled = value ?? DEFAULT_DISABLED;
    this.#updateWizardStepState();
  }

  @Input()
  public tabIndex: SkyTabIndex | undefined;

  @Input()
  public tabNumber: number | undefined;

  @Input()
  public totalTabsCount: number | undefined;

  @Input()
  public get tabStyle(): SkyTabsetStyle | undefined {
    return this.#_tabStyle;
  }

  public set tabStyle(style: SkyTabsetStyle | undefined) {
    this.#_tabStyle = style;
    this.#updateWizardStepState();
  }

  @Output()
  public buttonClick = new EventEmitter<void>();

  @Output()
  public closeClick = new EventEmitter<void>();

  constructor(
    elementRef: ElementRef,
    adapterService: SkyTabButtonAdapterService,
    changeDetectorRef: ChangeDetectorRef,
    tabsetService: SkyTabsetService,
  ) {
    this.#adapterService = adapterService;
    this.#changeDetectorRef = changeDetectorRef;
    this.#elementRef = elementRef;
    this.#tabsetService = tabsetService;
  }

  public closeBtnTabIndex = '-1';
  public wizardStepState: SkyWizardStepState | undefined;
  #_isActive: boolean | undefined = false;
  #_isDisabled = DEFAULT_DISABLED;
  #_tabStyle: SkyTabsetStyle | undefined;
  #adapterService: SkyTabButtonAdapterService;
  #changeDetectorRef: ChangeDetectorRef;
  #elementRef: ElementRef;
  #tabsetService: SkyTabsetService;
  #ngUnsubscribe = new Subject<void>();

  public ngAfterViewInit(): void {
    this.#tabsetService.focusedTabBtnIndex
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((focusedIndex) => {
        if (this.tabIndex !== undefined && focusedIndex === this.tabIndex) {
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
    if (this.tabIndex !== undefined) {
      this.#tabsetService.setFocusedTabBtnIndex(this.tabIndex);
    }
  }

  #updateWizardStepState(): void {
    if (this.tabStyle === 'tabs') {
      this.wizardStepState = undefined;
    } else {
      if (this.active) {
        this.wizardStepState = 'current';
      } else if (!this.disabled) {
        this.wizardStepState = 'completed';
      } else {
        this.wizardStepState = 'unavailable';
      }
    }

    this.#changeDetectorRef.markForCheck();
  }
}
