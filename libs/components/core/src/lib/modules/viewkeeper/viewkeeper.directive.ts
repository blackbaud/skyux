import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  RendererFactory2,
  inject,
} from '@angular/core';

import { Subject, animationFrameScheduler, fromEvent, observeOn } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';
import { SkyScrollableHostService } from '../scrollable-host/scrollable-host.service';

import { SkyViewkeeper } from './viewkeeper';
import { SkyViewkeeperService } from './viewkeeper.service';

@Directive({
  selector: '[skyViewkeeper]',
  standalone: false,
})
export class SkyViewkeeperDirective
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input()
  public set skyViewkeeper(value: string[] | undefined) {
    this.#_skyViewkeeper = value;

    this.#detectElements();
  }

  public get skyViewkeeper(): string[] | undefined {
    return this.#_skyViewkeeper;
  }

  @Input()
  public skyViewkeeperOmitShadow: string | undefined;

  #_skyViewkeeper: string[] | undefined;

  #currentViewkeeperEls: HTMLElement[] | undefined;

  #el: ElementRef;

  #mutationObserverSvc: SkyMutationObserverService;

  #observer: MutationObserver | undefined;

  #scrollableHostSvc: SkyScrollableHostService | undefined;

  #scrollableHostWatchUnsubscribe: Subject<void> | undefined;

  #viewkeepers: SkyViewkeeper[] = [];

  #viewkeeperSvc: SkyViewkeeperService;

  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);
  #shadowElement: HTMLElement | undefined;

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
    this.#observer?.disconnect();
    this.#scrollableHostWatchUnsubscribe?.next();
    this.#scrollableHostWatchUnsubscribe?.complete();
    this.#destroyViewkeepers();
    this.#renderer.removeChild(this.#el.nativeElement, this.#shadowElement);
  }

  public ngAfterViewInit(): void {
    const shadowElement = this.#renderer.createElement('div');
    shadowElement.classList.add('sky-viewkeeper-shadow');
    if (this.#el.nativeElement.firstChild) {
      this.#renderer.insertBefore(
        this.#el.nativeElement,
        shadowElement,
        this.#el.nativeElement.firstChild,
      );
    } else {
      this.#renderer.appendChild(this.#el.nativeElement, shadowElement);
    }
    this.#shadowElement = shadowElement;
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
      this.#scrollableHostWatchUnsubscribe?.next();
      this.#scrollableHostWatchUnsubscribe?.complete();
      this.#scrollableHostWatchUnsubscribe = new Subject();

      if (this.#scrollableHostSvc) {
        this.#scrollableHostSvc
          .watchScrollableHost(this.#el)
          .pipe(takeUntil(this.#scrollableHostWatchUnsubscribe))
          .subscribe((scrollableHost) => {
            this.#destroyViewkeepers();

            let previousViewkeeperEl: HTMLElement | undefined = undefined;

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
      this.#scrollableHostWatchUnsubscribe.pipe(take(1)).subscribe(() => {
        this.#shadowElement?.classList.remove('sky-viewkeeper-shadow--active');
      });
      fromEvent(viewkeeperEls, 'afterViewkeeperSync')
        .pipe(
          takeUntil(this.#scrollableHostWatchUnsubscribe),
          observeOn(animationFrameScheduler),
        )
        .subscribe(() => {
          const applicable = viewkeeperEls.filter(
            (el) =>
              el.classList.contains('sky-viewkeeper-fixed') &&
              (!this.skyViewkeeperOmitShadow ||
                !el.matches(this.skyViewkeeperOmitShadow)),
          );
          if (applicable.length === 0) {
            this.#shadowElement?.classList.remove(
              'sky-viewkeeper-shadow--active',
            );
            return;
          }
          this.#shadowElement?.classList.add('sky-viewkeeper-shadow--active');
          const boundingRectangles = applicable.map((el) =>
            el.getBoundingClientRect(),
          );
          const left = boundingRectangles.reduce(
            (num, rect) => Math.min(num, rect.left),
            Number.POSITIVE_INFINITY,
          );
          const right = boundingRectangles.reduce(
            (num, rect) => Math.max(num, rect.right),
            Number.NEGATIVE_INFINITY,
          );
          const top = boundingRectangles.reduce(
            (num, rect) => Math.min(num, rect.top),
            Number.POSITIVE_INFINITY,
          );
          const bottom = boundingRectangles.reduce(
            (num, rect) => Math.max(num, rect.bottom),
            Number.NEGATIVE_INFINITY,
          );
          this.#renderer.setStyle(
            this.#shadowElement,
            'inset',
            `${top}px ${window.innerWidth - right}px ${window.innerHeight - bottom}px ${left}px`,
          );
        });

      this.#currentViewkeeperEls = viewkeeperEls;
    }
  }
}
