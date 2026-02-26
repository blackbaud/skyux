import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyCoreAdapterService, SkyResponsiveHostDirective } from '@skyux/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkySplitViewAdapterService } from './split-view-adapter.service';
import { SkySplitViewDrawerComponent } from './split-view-drawer.component';
import { SkySplitViewService } from './split-view.service';
import { SkySplitViewDockType } from './types/split-view-dock-type';
import { SkySplitViewMessage } from './types/split-view-message';
import { SkySplitViewMessageType } from './types/split-view-message-type';

/**
 * Displays a list alongside a workspace where users can view details for selected items
 * and take actions.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyResponsiveHostDirective],
  imports: [CommonModule],
  providers: [SkySplitViewAdapterService, SkySplitViewService],
  selector: 'sky-split-view',
  styleUrl: './split-view.component.scss',
  templateUrl: './split-view.component.html',
})
export class SkySplitViewComponent implements OnInit, OnDestroy {
  /**
   * The label for the button that appears in the workspace header in responsive mode.
   * The button returns users to the list.
   * @default "Back to list"
   */
  @Input()
  public set backButtonText(value: string) {
    if (value) {
      this.#splitViewService.updateBackButtonText(value);
    }
  }

  /**
   * Whether the split view's height is bound to the window height.
   * @default false
   * @deprecated We recommend using the `dock` input instead. An example of this can
   * be found in the developer code examples.
   */
  @Input()
  public set bindHeightToWindow(bindToHeight: boolean) {
    this.#_bindHeightToWindow = bindToHeight;

    if (this.#bindHeightToWindowUnsubscribe) {
      this.#bindHeightToWindowUnsubscribe.next();
      this.#bindHeightToWindowUnsubscribe.complete();
    }

    if (bindToHeight) {
      this.#bindHeightToWindowUnsubscribe = new Subject();
      this.#adapter.bindHeightToWindow(
        this.#elementRef,
        this.#bindHeightToWindowUnsubscribe,
      );
    }
  }

  public get bindHeightToWindow(): boolean {
    return this.#_bindHeightToWindow;
  }

  /**
   * How the split view docks to its container. Use `fill` to dock
   * the split view to the container's size where the container is a `sky-page` component
   * with its `layout` input set to `fit`, or where the container is another element with
   * a relative or absolute position and a fixed size.
   * @default "none"
   */
  @Input()
  public set dock(value: SkySplitViewDockType | undefined) {
    this.#_dock = value || 'none';
  }

  public get dock(): SkySplitViewDockType {
    return this.#_dock;
  }

  /**
   * The observable that sends commands to the split view component.
   * The commands should respect the `SkySplitViewMessage` type.
   */
  @Input()
  public messageStream = new Subject<SkySplitViewMessage>();

  @ContentChild(SkySplitViewDrawerComponent)
  public drawerComponent: SkySplitViewDrawerComponent | undefined;

  public set drawerVisible(value: boolean) {
    this.#_drawerVisible = value;
    this.#changeDetectorRef.markForCheck();
  }

  public get drawerVisible(): boolean {
    return !this.isMobile || this.#_drawerVisible;
  }

  public animationEnabled = false;
  public isMobile = false;
  public nextButtonDisabled = false;
  public previousButtonDisabled = false;

  public get workspaceVisible(): boolean {
    return !this.isMobile || !this.#_drawerVisible;
  }

  #animationComplete = new Subject<void>();
  #bindHeightToWindowUnsubscribe: Subject<void> | undefined;
  #ngUnsubscribe = new Subject<void>();
  #adapter: SkySplitViewAdapterService;
  #changeDetectorRef: ChangeDetectorRef;
  #coreAdapterService: SkyCoreAdapterService;
  #elementRef: ElementRef;
  #splitViewService: SkySplitViewService;

  #_bindHeightToWindow = false;
  #_drawerVisible = true;
  #_dock: SkySplitViewDockType = 'none';

  constructor(
    adapter: SkySplitViewAdapterService,
    changeDetectorRef: ChangeDetectorRef,
    coreAdapterService: SkyCoreAdapterService,
    elementRef: ElementRef,
    splitViewService: SkySplitViewService,
  ) {
    this.#adapter = adapter;
    this.#changeDetectorRef = changeDetectorRef;
    this.#coreAdapterService = coreAdapterService;
    this.#elementRef = elementRef;
    this.#splitViewService = splitViewService;

    splitViewService.splitViewElementRef = elementRef;
  }

  public ngOnInit(): void {
    // Enable CSS transitions after initial render to prevent animations on load.
    setTimeout(() => {
      this.animationEnabled = true;
      this.#changeDetectorRef.markForCheck();
    });

    this.#splitViewService.isMobileStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.#changeDetectorRef.markForCheck();
      });

    this.#splitViewService.drawerVisible
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((visible: boolean) => {
        this.drawerVisible = visible;
      });

    this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkySplitViewMessage) => {
        this.#handleIncomingMessages(message);
      });
  }

  public ngOnDestroy(): void {
    if (this.#bindHeightToWindowUnsubscribe) {
      this.#bindHeightToWindowUnsubscribe.next();
      this.#bindHeightToWindowUnsubscribe.complete();
    }

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onWorkspaceTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'transform') {
      this.#animationComplete.next();
    }
  }

  #applyAutofocus(): void {
    const applyAutoFocus = this.#coreAdapterService.applyAutoFocus(
      this.#elementRef,
    );
    /*istanbul ignore else*/
    if (!applyAutoFocus) {
      this.#coreAdapterService.getFocusableChildrenAndApplyFocus(
        this.#elementRef,
        '.sky-split-view-workspace-content',
      );
    }
  }

  #handleIncomingMessages(message: SkySplitViewMessage): void {
    switch (message.type) {
      case SkySplitViewMessageType.FocusWorkspace:
        // If mobile, wait until animation is complete then set focus on workspace panel.
        // Otherwise, just set focus right away.
        if (!this.workspaceVisible) {
          this.drawerVisible = false;
          this.#animationComplete.pipe(take(1)).subscribe(() => {
            this.#applyAutofocus();
          });
        } else {
          this.#applyAutofocus();
        }
        this.#changeDetectorRef.markForCheck();
        break;
    }
  }
}
