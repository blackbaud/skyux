import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { skyAnimationSlide } from '@skyux/animations';
import { SkyIdModule, SkyIdService, SkyLogService } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';
import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';

import { SKY_TILE_TITLE_ID } from './tile-title-id-token';
import { SkyTileTitleComponent } from './tile-title.component';

/**
 * Provides a common look-and-feel for tab content.
 */
@Component({
  selector: 'sky-tile',
  styleUrls: ['./tile.component.scss'],
  templateUrl: './tile.component.html',
  animations: [skyAnimationSlide],
  imports: [
    CommonModule,
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
    SkyTilesResourcesModule,
  ],
  providers: [
    {
      provide: SKY_TILE_TITLE_ID,
      useFactory(): string {
        const idService = inject(SkyIdService);
        return idService.generateId();
      },
    },
  ],
})
export class SkyTileComponent implements OnChanges, OnDestroy {
  /**
   * A help key that identifies the global help content to display. When specified along with `tileName`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * added to the tile header. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) as configured by the application.
   * This property only applies when `tileName` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified along with `tileName`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the tile header. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `tileName` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * Whether to display a settings button in the tile header. To display the
   * button, you must also listen for the `settingsClick` event.
   * @default true
   */
  @Input()
  public showSettings = true;

  /**
   * Whether to display a help button in the tile header. To display the
   * button, you must also listen for the `helpClick` event.
   * @default true
   * @deprecated Set the `helpKey` or `helpPopoverContent` inputs instead.
   */
  @Input()
  public showHelp = true;

  /**
   * The human-readable name for the tile that is available to the tile controls for multiple purposes, such as accessibility and instrumentation. The component uses the name to construct ARIA labels for the help, expand/collapse, settings, and drag handle buttons to [support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For example, if the tile name is "Constituents," the help input's `aria-label` is "Constituents help" and the drag handle's `aria-label` is "Move Constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public tileName: string | undefined;

  /**
   * Fires when users select the settings button in the tile header. The settings
   * button only appears when the `showSettings` property is set to `true`.
   */
  @Output()
  public settingsClick = new EventEmitter();

  /**
   * Fires when the tile's collapsed state changes. Returns `true` when the tile
   * collapses and `false` when it expands.
   */
  @Output()
  public isCollapsedChange = new EventEmitter<boolean>();

  /**
   * Fires when users select the help button in the tile header. The help
   * button only appears when the `showHelp` property is set to `true`.
   * @deprecated Set the `helpKey` or `helpPopoverContent` inputs instead.
   */
  @Output()
  public helpClick = new EventEmitter();

  public get isCollapsed(): boolean {
    if (this.#dashboardService) {
      const configCollapsedState = this.#dashboardService.tileIsCollapsed(this);
      this.#_isCollapsed = configCollapsedState;
    }

    return this.#_isCollapsed;
  }

  /**
   * Whether the tile is in a collapsed state.
   * @default false
   */
  @Input()
  public set isCollapsed(value: boolean | undefined) {
    this.#_isCollapsed = !!value;

    if (this.#dashboardService) {
      this.#dashboardService.setTileCollapsed(this, this.#_isCollapsed);
    }

    this.isCollapsedChange.emit(this.#_isCollapsed);
  }

  public ariaDescribedBy: string | undefined;

  public isInDashboardColumn = false;

  @ViewChild('grabHandle', {
    read: ElementRef,
    static: false,
  })
  public grabHandle: ElementRef | undefined;

  @ViewChild('titleContainer', {
    read: ElementRef,
    static: false,
  })
  public title: ElementRef | undefined;

  @ContentChild(SkyTileTitleComponent, { read: ElementRef })
  protected titleRef: ElementRef | undefined;

  #changeDetector: ChangeDetectorRef;
  #dashboardService: SkyTileDashboardService | undefined;
  #ngUnsubscribe = new Subject<void>();
  #_isCollapsed = false;

  protected tileTitleId = inject(SKY_TILE_TITLE_ID);

  readonly #logSvc = inject(SkyLogService);

  constructor(
    public elementRef: ElementRef,
    changeDetector: ChangeDetectorRef,
    @Optional() dashboardService?: SkyTileDashboardService,
  ) {
    this.#changeDetector = changeDetector;
    this.#dashboardService = dashboardService;
    this.isInDashboardColumn = !!this.#dashboardService;

    if (this.#dashboardService) {
      this.ariaDescribedBy = `${this.#dashboardService.bagId}-move-instructions`;

      /**
       * This subscription ensures that if any values which come in from the dashboard service are
       * updated that the component will update if the tile's parent component utilizes OnPush
       * change detection.
       */
      this.#dashboardService.configChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#changeDetector.markForCheck();
        });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['showHelp']?.firstChange) {
      this.#logSvc.deprecated('SkyTileComponent.showHelp', {
        deprecationMajorVersion: 10,
        replacementRecommendation:
          'Set the `helpKey` or `helpPopoverContent` inputs instead.',
      });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public settingsButtonClicked(): void {
    this.settingsClick.emit(undefined);
  }

  /**
   * @deprecated
   */
  public helpButtonClicked(): void {
    this.helpClick.emit(undefined);
  }

  public get hasSettings(): boolean {
    return this.settingsClick.observed && this.showSettings;
  }

  /**
   * @deprecated
   */
  public get hasHelp(): boolean {
    return this.helpClick.observed && this.showHelp;
  }

  public titleClick(evt: MouseEvent): void {
    const targetEl = evt.target as HTMLElement | null;

    // Don't expand/collapse if the help inline button is clicked.
    if (targetEl?.closest('sky-help-inline') === null) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  public chevronDirectionChange(direction: string): void {
    this.isCollapsed = direction === 'down';
  }

  protected moveTile(event: KeyboardEvent): void {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) &&
      this.#dashboardService
    ) {
      const direction = event.key.toLowerCase().replace('arrow', '') as
        | 'up'
        | 'down'
        | 'left'
        | 'right';
      this.#dashboardService.moveTileOnKeyDown(
        this,
        direction,
        this.title?.nativeElement.innerText,
      );
      this.#focusHandle();
    }
  }

  #focusHandle(): void {
    this.grabHandle?.nativeElement.focus();
  }
}
