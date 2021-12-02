import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';
import { SkyScrollableHostService } from '../scrollable-host/scrollable-host.service';

import {
  SkyViewkeeper
} from './viewkeeper';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

@Directive({
  selector: '[skyViewkeeper]'
})
export class SkyViewkeeperDirective implements OnInit, OnDestroy {

  @Input()
  public set skyViewkeeper(value: string[]) {
    this._skyViewkeeper = value;

    this.detectElements();
  }

  public get skyViewkeeper(): string[] {
    return this._skyViewkeeper;
  }

  private _skyViewkeeper: string[];

  private viewkeepers: SkyViewkeeper[] = [];

  private observer: MutationObserver;

  private currentViewkeeperEls: HTMLElement[];

  private scrollableHostWatchUnsubscribe: Subject<void> | undefined = undefined;

  constructor(
    private el: ElementRef,
    private mutationObserverSvc: MutationObserverService,
    private viewkeeperSvc: SkyViewkeeperService,
    @Optional() private scrollableHostService: SkyScrollableHostService
  ) { }

  public ngOnInit(): void {
    this.observer = this.mutationObserverSvc.create(() => this.detectElements());

    this.observer.observe(
      this.el.nativeElement,
      {
        childList: true,
        subtree: true
      }
    );
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();

    this.destroyViewkeepers();
  }

  private destroyViewkeepers(): void {
    for (const viewkeeper of this.viewkeepers) {
      this.viewkeeperSvc.destroy(viewkeeper);
    }

    this.viewkeepers = [];
  }

  private getViewkeeperEls(): HTMLElement[] {
    let viewkeeperEls: HTMLElement[];

    if (this.skyViewkeeper) {
      viewkeeperEls = [];

      for (const item of this.skyViewkeeper) {
        let matchingEls = Array.from(
          (this.el.nativeElement as HTMLElement).querySelectorAll(item)
        ) as HTMLElement[];

        viewkeeperEls = [...viewkeeperEls, ...matchingEls];
      }
    }

    return viewkeeperEls;
  }

  private viewkeeperElsChanged(viewkeeperEls: HTMLElement[]): boolean {
    if (!viewkeeperEls !== !this.currentViewkeeperEls) {
      return true;
    }

    if (viewkeeperEls && this.currentViewkeeperEls) {
      if (viewkeeperEls.length !== this.currentViewkeeperEls.length) {
        return true;
      }

      for (let i = 0, n = viewkeeperEls.length; i < n; i++) {
        if (viewkeeperEls[i] !== this.currentViewkeeperEls[i]) {
          return true;
        }
      }
    }

    return false;
  }

  private detectElements(): void {
    let viewkeeperEls = this.getViewkeeperEls();

    if (this.viewkeeperElsChanged(viewkeeperEls)) {

      if (this.scrollableHostWatchUnsubscribe) {
        this.scrollableHostWatchUnsubscribe.next();
        this.scrollableHostWatchUnsubscribe = new Subject();
      } else {
        this.scrollableHostWatchUnsubscribe = new Subject();
      }

      this.scrollableHostService.watchScrollableHost(this.el)
        .pipe(takeUntil(this.scrollableHostWatchUnsubscribe))
        .subscribe(scrollableHost => {
          this.destroyViewkeepers();

          let previousViewkeeperEl: HTMLElement;

          for (const viewkeeperEl of viewkeeperEls) {
            this.viewkeepers.push(
              this.viewkeeperSvc.create(
                {
                  boundaryEl: this.el.nativeElement,
                  scrollableHost: scrollableHost instanceof HTMLElement ? scrollableHost : undefined,
                  el: viewkeeperEl,
                  setWidth: true,
                  verticalOffsetEl: previousViewkeeperEl
                }
              )
            );

            previousViewkeeperEl = viewkeeperEl;
          }
        });


      this.currentViewkeeperEls = viewkeeperEls;
    }
  }
}
