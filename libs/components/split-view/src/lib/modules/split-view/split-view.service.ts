import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Internal service for operations between the split view drawer and workspace.
 * @internal
 */
@Injectable()
export class SkySplitViewService implements OnDestroy {
  public get backButtonTextStream(): Observable<string> {
    return this.#_backButtonTextStream;
  }

  public drawerVisible = new BehaviorSubject<boolean>(true);

  public get drawerWidthStream(): Observable<number> {
    return this.#_drawerWidthStream;
  }

  public splitViewElementRef: ElementRef | undefined;

  public set isMobile(value: boolean) {
    this.#_isMobile = value;
  }

  public get isMobile(): boolean {
    return this.#_isMobile;
  }

  public get isMobileStream(): Observable<boolean> {
    return this.#_isMobileStream;
  }

  #mediaQueryServiceSubscription: Subscription;

  #_backButtonTextStream = new BehaviorSubject<string>('');
  #_drawerWidthStream = new BehaviorSubject<number>(320);
  #_isMobile = false;
  #_isMobileStream = new BehaviorSubject<boolean>(false);

  constructor(
    mediaQueryService: SkyMediaQueryService,
    resources: SkyLibResourcesService,
  ) {
    // Set default back button text.
    resources
      .getString('skyux_split_view_back_to_list')
      .pipe(take(1))
      .subscribe((resource) => {
        this.updateBackButtonText(resource);
      });

    // Set breakpoint.
    this.#mediaQueryServiceSubscription = mediaQueryService.subscribe(
      (breakpoint) => {
        const nowMobile = breakpoint === SkyMediaBreakpoints.xs;
        if (nowMobile && !this.isMobile) {
          // switching to mobile
          this.#_isMobileStream.next(true);
          this.drawerVisible.next(false);
        } else if (!nowMobile && this.isMobile) {
          // switching to widescreen
          this.#_isMobileStream.next(false);
          this.drawerVisible.next(true);
        }
        this.isMobile = nowMobile;
      },
    );
  }

  public ngOnDestroy(): void {
    this.#mediaQueryServiceSubscription.unsubscribe();
  }

  public backButtonClick(): void {
    this.drawerVisible.next(true);
  }

  public updateBackButtonText(text: string): void {
    this.#_backButtonTextStream.next(text);
  }

  public updateDrawerWidth(drawerWidth: number): void {
    this.#_drawerWidthStream.next(drawerWidth);
  }
}
