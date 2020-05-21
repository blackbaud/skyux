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
  Subject
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

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

@Component({
  selector: 'sky-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  providers: [SkySplitViewService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'blockAnimationOnLoad', [
        transition(':enter', [])
      ]
    ),
    trigger(
      'drawerEnter', [
        state('false', style({transform: 'translate(-100%)'})),
        transition('* => true', animate('150ms ease-in'))
      ]),
    trigger(
      'workspaceEnter', [
        state('false', style({transform: 'translate(100%)'})),
        transition('* => true', animate('150ms ease-in'))
      ]
    )
  ]
})
export class SkySplitViewComponent implements OnInit, OnDestroy {

  @Input()
  public set backButtonText(value: string) {
    if (value) {
      this.splitViewService.updateBackButtonText(value);
    }
  }

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

  private ngUnsubscribe = new Subject<void>();

  private _drawerVisible = true;

  constructor(
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

    this.mediaQueryService.subscribe(breakpoint => {
      this.coreAdapterService.setResponsiveContainerClass(this.elementRef, breakpoint);
    });
  }

  public ngOnDestroy(): void {
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
