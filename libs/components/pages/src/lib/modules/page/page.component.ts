import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyHelpService, SkyLayoutHostService } from '@skyux/core';

import { SkyPageLinksComponent } from './page-links.component';
import { SkyPageThemeAdapterService } from './page-theme-adapter.service';
import { SkyPageLayoutType } from './types/page-layout-type';

const LAYOUT_DEFAULT: SkyPageLayoutType = 'none';

const LAYOUT_FOR_CHILD_CLASS_PREFIX = 'sky-layout-host-for-child-';
const LAYOUT_CLASS_PREFIX = 'sky-layout-host-';
const LAYOUT_CLASS_DEFAULT = `${LAYOUT_CLASS_PREFIX}${LAYOUT_DEFAULT}`;
const LAYOUT_WITH_LINKS = `sky-layout-with-links`;

/**
 * Displays a page using the specified layout. The page component is a responsive container,
 * meaning content will respect the breakpoints within the page element instead of the window.
 * This is helpful if there is other content to the left or right of the page.
 */
@Component({
  selector: 'sky-page',
  template: `<ng-content />`,
  providers: [SkyPageThemeAdapterService, SkyLayoutHostService],
  host: {
    '[class]': 'cssClass()',
  },
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout that applies spacing to the page header and content. Use the layout
   * that corresponds with the top-level component type used on the page, or use `fit` to
   * constrain the page contents to the available viewport.
   * Use `none` for custom content that does not adhere to predefined spacing or constraints.
   * @default "none"
   */
  public readonly layout = input<SkyPageLayoutType | undefined>();

  /**
   * A help key that identifies the page's default [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) content to display.
   */
  @Input()
  public set helpKey(value: string | undefined) {
    this.#helpSvc?.updateHelp({ pageDefaultHelpKey: value });
  }

  public readonly cssClass: Signal<string>;

  protected pageLinks = contentChild(SkyPageLinksComponent);

  readonly #helpSvc = inject(SkyHelpService, { optional: true });
  readonly #layoutHostSvc = inject(SkyLayoutHostService);
  readonly #themeAdapter = inject(SkyPageThemeAdapterService);

  constructor() {
    const layoutForChildSignal = toSignal(
      this.#layoutHostSvc.hostLayoutForChild,
    );
    this.cssClass = computed(() => {
      const cssClass: string[] = [];

      const layout = this.layout();
      if (layout) {
        cssClass.push(`${LAYOUT_CLASS_PREFIX}${layout}`);
      } else {
        cssClass.push(LAYOUT_CLASS_DEFAULT);
      }

      const layoutForChild = layoutForChildSignal();
      if (layoutForChild) {
        cssClass.push(
          `${LAYOUT_FOR_CHILD_CLASS_PREFIX}${layoutForChild.layout}`,
        );
      }

      if (this.pageLinks()) {
        cssClass.push(LAYOUT_WITH_LINKS);
      }

      return cssClass.join(' ');
    });
  }

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();
    this.#helpSvc?.updateHelp({ pageDefaultHelpKey: undefined });
  }
}
