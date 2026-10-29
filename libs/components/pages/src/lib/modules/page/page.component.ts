import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';
import {
  SkyContainerBreakpointObserver,
  SkyHelpService,
  SkyLayoutHostDirective,
  provideSkyBreakpointObserver,
} from '@skyux/core';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';
import { SkyPageLayoutType } from './types/page-layout-type';

/**
 * Displays a page using the specified layout. The page component is a responsive container,
 * meaning content will respect the breakpoints within the page element instead of the window.
 * This is helpful if there is other content to the left or right of the page.
 */
@Component({
  selector: 'sky-page',
  template: `<ng-content />`,
  styleUrls: ['./page.component.scss'],
  providers: [
    SkyPageThemeAdapterService,
    provideSkyBreakpointObserver(SkyContainerBreakpointObserver),
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  hostDirectives: [
    {
      directive: SkyLayoutHostDirective,
      inputs: ['layout'],
    },
  ],
})
export class SkyPageComponent implements OnInit, OnDestroy {
  /**
   * The page layout that applies spacing to the page header and content. Use the layout
   * that corresponds with the top-level component type used on the page, or use `fit` to
   * constrain the page contents to the available viewport.
   * Use `none` for custom content that does not adhere to predefined spacing or constraints.
   * @default "none"
   */
  public layout = input<SkyPageLayoutType>('none');

  /**
   * A help key that identifies the page's default [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) content to display.
   */
  @Input()
  public set helpKey(value: string | undefined) {
    // Skip unchanged values so an unset input doesn't clear a page default
    // help key set by other means, such as the `bb-help-key` directive.
    if (value !== this.#helpKey) {
      this.#helpKey = value;
      this.#helpSvc?.updateHelp({ pageDefaultHelpKey: value });
    }
  }

  #helpKey: string | undefined;

  readonly #themeAdapter = inject(SkyPageThemeAdapterService);
  readonly #helpSvc = inject(SkyHelpService, { optional: true });

  public ngOnInit(): void {
    this.#themeAdapter.addTheme();
  }

  public ngOnDestroy(): void {
    this.#themeAdapter.removeTheme();

    if (this.#helpKey !== undefined) {
      this.#helpSvc?.updateHelp({ pageDefaultHelpKey: undefined });
    }
  }
}
