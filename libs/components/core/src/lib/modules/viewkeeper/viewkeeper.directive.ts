import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';
import { SkyScrollableHostService } from '../scrollable-host/scrollable-host.service';

import { SkyViewkeeper } from './viewkeeper';
import { SkyViewkeeperService } from './viewkeeper.service';

@Directive({
  selector: '[skyViewkeeper]',
  standalone: false,
})
export class SkyViewkeeperDirective implements OnInit, OnDestroy {
  @Input()
  public set skyViewkeeper(value: string[] | undefined) {
    this.#_skyViewkeeper = value;

    this.#detectElements();
  }

  public get skyViewkeeper(): string[] | undefined {
    return this.#_skyViewkeeper;
  }

  #_skyViewkeeper: string[] | undefined;

  #currentViewkeeperEls: HTMLElement[] | undefined;

  #el: ElementRef;

  #mutationObserverSvc: SkyMutationObserverService;

  #observer: MutationObserver | undefined;

  #scrollableHostSvc: SkyScrollableHostService | undefined;

  #scrollableHostWatchUnsubscribe: Subject<void> | undefined;

  #viewkeepers: SkyViewkeeper[] = [];

  #viewkeeperSvc: SkyViewkeeperService;

  constructor(
    el: ElementRef,
    mutationObserverSvc: SkyMutationObserverService,
    viewkeeperSvc: SkyViewkeeperService,
    @Optional() scrollableHostSvc?: SkyScrollableHostService,
  ) {
    this.#el = el;
    this.#mutationObserverSvc = mutationObserverSvc;
    this.#viewkeeperSvc = viewkeeperSvc;
    this.#scrollableHostSvc = scrollableHostSvc;
  }

  public ngOnInit(): void {
    this.#observer = this.#mutationObserverSvc.create(() =>
      this.#detectElements(),
    );

    this.#observer.observe(this.#el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  public ngOnDestroy(): void {
    /*istanbul ignore else*/
    if (this.#observer) {
      this.#observer.disconnect();
    }

    /*istanbul ignore else*/
    if (this.#scrollableHostWatchUnsubscribe) {
      this.#scrollableHostWatchUnsubscribe.next();
      this.#scrollableHostWatchUnsubscribe.complete();
    }

    this.#destroyViewkeepers();
  }

  #destroyViewkeepers(): void {
    for (const viewkeeper of this.#viewkeepers) {
      this.#viewkeeperSvc.destroy(viewkeeper);
    }

    this.#viewkeepers = [];
  }

  #getViewkeeperEls(): HTMLElement[] {
    let viewkeeperEls: HTMLElement[] = [];

    if (this.skyViewkeeper) {
      viewkeeperEls = [];

      for (const item of this.skyViewkeeper) {
        const matchingEls = Array.from(
          (this.#el.nativeElement as HTMLElement).querySelectorAll(item),
        ) as HTMLElement[];

        viewkeeperEls = [...viewkeeperEls, ...matchingEls];
      }
    }

    return viewkeeperEls;
  }

  #viewkeeperElsChanged(viewkeeperEls: HTMLElement[]): boolean {
    if (!viewkeeperEls !== !this.#currentViewkeeperEls) {
      return true;
    }

    if (viewkeeperEls && this.#currentViewkeeperEls) {
      if (viewkeeperEls.length !== this.#currentViewkeeperEls.length) {
        return true;
      }

      for (let i = 0, n = viewkeeperEls.length; i < n; i++) {
        if (viewkeeperEls[i] !== this.#currentViewkeeperEls[i]) {
          return true;
        }
      }
    }

    return false;
  }

  #detectElements(): void {
    const viewkeeperEls = this.#getViewkeeperEls();

    if (this.#viewkeeperElsChanged(viewkeeperEls)) {
      if (this.#scrollableHostWatchUnsubscribe) {
        this.#scrollableHostWatchUnsubscribe.next();
        this.#scrollableHostWatchUnsubscribe.complete();
        this.#scrollableHostWatchUnsubscribe = new Subject();
      } else {
        this.#scrollableHostWatchUnsubscribe = new Subject();
      }

      if (this.#scrollableHostSvc) {
        this.#scrollableHostSvc
          .watchScrollableHost(this.#el)
          .pipe(takeUntil(this.#scrollableHostWatchUnsubscribe))
          .subscribe((scrollableHost) => {
            this.#destroyViewkeepers();

            let previousViewkeeperEl: HTMLElement | undefined;

            for (const viewkeeperEl of viewkeeperEls) {
              this.#viewkeepers.push(
                this.#viewkeeperSvc.create({
                  boundaryEl: this.#el.nativeElement,
                  scrollableHost:
                    scrollableHost instanceof HTMLElement
                      ? scrollableHost
                      : undefined,
                  el: viewkeeperEl,
                  setWidth: true,
                  verticalOffsetEl: previousViewkeeperEl,
                }),
              );

              previousViewkeeperEl = viewkeeperEl;
            }
          });
      }

      this.#currentViewkeeperEls = viewkeeperEls;
    }
  }
}
