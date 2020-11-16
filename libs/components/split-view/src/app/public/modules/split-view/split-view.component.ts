import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  SkyCoreAdapterService,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Subject,
  Subscription
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkySplitViewAdapterService
} from './split-view-adapter.service';

import {
  SkySplitViewMessage
} from './types/split-view-message';

import {
  SkySplitViewMessageType
} from './types/split-view-message-type';

import {
  SkySplitViewDrawerComponent
} from './split-view-drawer.component';

import {
  SkySplitViewService
} from './split-view.service';

/**
 * Displays a list alongside a workspace where users can view details for selected items
 * and take actions.
 */
@Component({
  selector: 'sky-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  providers: [
    SkySplitViewAdapterService,
    SkySplitViewService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'blockAnimationOnLoad', [
      transition(':enter', [])
    ]
    ),
    trigger(
      'drawerEnter', [
      state('false', style({ transform: 'translate(-100%)' })),
      transition('* => true', animate('150ms ease-in'))
    ]),
    trigger(
      'workspaceEnter', [
      state('false', style({ transform: 'translate(100%)' })),
      transition('* => true', animate('150ms ease-in'))
    ]
    )
  ]
})
export class SkySplitViewComponent implements OnInit, OnDestroy {

  /**
   * Specifies a label for the button that appears in the workspace header in responsive mode.
   * The button returns users to the list.
   * @default Back to list
   */
  @Input()
  public set backButtonText(value: string) {
    if (value) {
      this.splitViewService.updateBackButtonText(value);
    }
  }

  /**
   * Indicates whether the split view's height should be bound to the window height.
   * @default false
   * @deprecated We recommend against using this property. This property will not react fully to
   * other elements changing and CSS solutions provide a better alternative. An example of using CSS
   * for this can be found in the developer code examples.
   */
  @Input()
  public set bindHeightToWindow(bindToHeight: boolean) {
    this._bindHeightToWindow = bindToHeight;

    if (bindToHeight) {
      this.bindHeightToWindowUnsubscribe = new Subject();
      this.adapter.bindHeightToWindow(this.elementRef, this.bindHeightToWindowUnsubscribe);
    } else if (this.bindHeightToWindowUnsubscribe) {
      this.bindHeightToWindowUnsubscribe.next();
      this.bindHeightToWindowUnsubscribe.complete();
    }
  }

  public get bindHeightToWindow(): boolean {
    return this._bindHeightToWindow;
  }

  /**
   * Provides an observable to send commands to the split view component.
   * The commands should respect the `SkySplitViewMessage` type.
   */
  @Input()
  public messageStream = new Subject<SkySplitViewMessage>();

  @ContentChild(SkySplitViewDrawerComponent)
  public drawerComponent: SkySplitViewDrawerComponent;

  public set drawerVisible(value: boolean) {
    this._drawerVisible = value;
    this.changeDetectorRef.markForCheck();
  }

  public get drawerVisible(): boolean {
    return !this.isMobile || this._drawerVisible;
  }

  public isMobile = false;

  public nextButtonDisabled = false;

  public previousButtonDisabled = false;

  public get workspaceVisible(): boolean {
    return !this.isMobile || !this._drawerVisible;
  }

  private animationComplete = new Subject<void>();

  private bindHeightToWindowUnsubscribe: Subject<void>;

  private mediaQuerySubscription: Subscription;

  private ngUnsubscribe = new Subject<void>();

  private _bindHeightToWindow = false;

  private _drawerVisible = true;

  constructor(
    private adapter: SkySplitViewAdapterService,
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService,
    private splitViewService: SkySplitViewService
  ) {
    splitViewService.splitViewElementRef = this.elementRef;
  }

  public ngOnInit(): void {
    this.splitViewService.isMobileStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeDetectorRef.markForCheck();
      });

    this.splitViewService.drawerVisible
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((visible: boolean) => {
        this.drawerVisible = visible;
      });

    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkySplitViewMessage) => {
        this.handleIncomingMessages(message);
      });

    this.mediaQuerySubscription = this.mediaQueryService.subscribe(breakpoint => {
      this.coreAdapterService.setResponsiveContainerClass(this.elementRef, breakpoint);
    });
  }

  public ngOnDestroy(): void {
    if (this.bindHeightToWindowUnsubscribe) {
      this.bindHeightToWindowUnsubscribe.next();
      this.bindHeightToWindowUnsubscribe.complete();
    }

    if (this.mediaQuerySubscription) {
      this.mediaQuerySubscription.unsubscribe();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onWorkspaceEnterComplete(): void {
    this.animationComplete.next();
  }

  private applyAutofocus(): void {
    const applyAutoFocus = this.coreAdapterService.applyAutoFocus(this.elementRef);
    if (!applyAutoFocus) {
      this.coreAdapterService.getFocusableChildrenAndApplyFocus(this.elementRef, '.sky-split-view-workspace-content');
    }
  }

  private handleIncomingMessages(message: SkySplitViewMessage): void {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkySplitViewMessageType.FocusWorkspace:
        // If mobile, wait until animation is complete then set focus on workspace panel.
        // Otherwise, just set focus right away.
        if (!this.workspaceVisible) {
          this.drawerVisible = false;
          this.animationComplete
            .pipe(take(1))
            .subscribe(() => {
              this.applyAutofocus();
            });
        } else {
          this.applyAutofocus();
        }
        this.changeDetectorRef.markForCheck();
        break;
    }
  }
}
