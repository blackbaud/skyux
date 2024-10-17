import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyHelpService,
  SkyLayoutHostForChildArgs,
  SkyLayoutHostService,
  SkyResponsiveHostDirective,
} from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';
import { SkyPageLayoutType } from './types/page-layout-type';

const LAYOUT_DEFAULT: SkyPageLayoutType = 'none';

const LAYOUT_FOR_CHILD_CLASS_PREFIX = 'sky-layout-host-for-child-';
const LAYOUT_CLASS_PREFIX = 'sky-layout-host-';
const LAYOUT_CLASS_DEFAULT = `${LAYOUT_CLASS_PREFIX}${LAYOUT_DEFAULT}`;

/**
 * Displays a page using the specified layout. The page component is a responsive container,
 * meaning content will respect the breakpoints within the page element instead of the window.
 * This is helpful if there is other content to the left or right of the page.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-page',
  template: `<ng-content />`,
  providers: [SkyPageThemeAdapterService, SkyLayoutHostService],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout that applies spacing to the page header and content. Use the layout
   * that corresponds with the top-level component type used on the page, or use `fit` to
   * constrain the page contents to the available viewport.
   * Use `none` for custom content that does not adhere to predefined spacing or constraints.
   * @default "none"
   */
  @Input()
  public set layout(value: SkyPageLayoutType | undefined) {
    this.#layout = value;
    this.#updateCssClass();
  }

  /**
   * A help key that identifies the page's default [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) content to display.
   */
  @Input()
  public set helpKey(value: string | undefined) {
    this.#helpSvc?.updateHelp({ pageDefaultHelpKey: value });
  }

  @HostBinding('class')
  public cssClass = LAYOUT_CLASS_DEFAULT;

  #layout: SkyPageLayoutType | undefined;
  #layoutForChild: SkyPageLayoutType | undefined;

  #ngUnsubscribe = new Subject<void>();

  #themeAdapter = inject(SkyPageThemeAdapterService);
  #layoutHostSvc = inject(SkyLayoutHostService);
  #helpSvc = inject(SkyHelpService, { optional: true });

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();

    this.#layoutHostSvc.hostLayoutForChild
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args: SkyLayoutHostForChildArgs) => {
        this.#layoutForChild = args.layout as SkyPageLayoutType;
        this.#updateCssClass();
      });
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#helpSvc?.updateHelp({ pageDefaultHelpKey: undefined });
  }

  #updateCssClass(): void {
    let cssClass = this.#layout
      ? `${LAYOUT_CLASS_PREFIX}${this.#layout}`
      : LAYOUT_CLASS_DEFAULT;

    if (this.#layoutForChild) {
      cssClass = `${cssClass} ${LAYOUT_FOR_CHILD_CLASS_PREFIX}${this.#layoutForChild}`;
    }

    this.cssClass = cssClass;
  }
}
