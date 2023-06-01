import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyLayoutHostService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';
import { SkyPageLayoutType } from './types/page-layout-type';

const LAYOUT_DEFAULT: SkyPageLayoutType = 'none';

const LAYOUT_FOR_CHILD_CLASS_PREFIX = 'sky-layout-host-for-child-';
const LAYOUT_CLASS_PREFIX = 'sky-layout-host-';
const LAYOUT_CLASS_DEFAULT = `${LAYOUT_CLASS_PREFIX}${LAYOUT_DEFAULT}`;

/**
 * Displays a page using the specified layout.
 */
@Component({
  selector: 'sky-page',
  template: `<ng-content />`,
  providers: [SkyPageThemeAdapterService, SkyLayoutHostService],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout that corresponds with the top-level component type
   * used on the page. For laying out custom content, use `auto` to allow
   * the page contents to expand beyond the bottom of the browser window
   * or `fit` to constrain the page contents to the available viewport.
   * @default "auto"
   */
  @Input()
  public set layout(value: SkyPageLayoutType | undefined) {
    this.#layout = value;
    this.#updateCssClass();
  }

  @HostBinding('class')
  public cssClass = LAYOUT_CLASS_DEFAULT;

  #layout: SkyPageLayoutType | undefined;
  #layoutForChild: SkyPageLayoutType | undefined;

  #ngUnsubscribe = new Subject<void>();

  #themeAdapter = inject(SkyPageThemeAdapterService);
  #layoutHostSvc = inject(SkyLayoutHostService);

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();

    this.#layoutHostSvc.hostLayoutForChild
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args) => {
        this.#layoutForChild = args.layout as SkyPageLayoutType;
        this.#updateCssClass();
      });
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #updateCssClass(): void {
    let cssClass = this.#layout
      ? `${LAYOUT_CLASS_PREFIX}${this.#layout}`
      : LAYOUT_CLASS_DEFAULT;

    if (this.#layoutForChild) {
      cssClass = `${cssClass} ${LAYOUT_FOR_CHILD_CLASS_PREFIX}${
        this.#layoutForChild
      }`;
    }

    this.cssClass = cssClass;
  }
}
