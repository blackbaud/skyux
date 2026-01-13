export { SkyCoreAdapterModule } from './lib/modules/adapter-service/adapter.module';
export { SkyCoreAdapterService } from './lib/modules/adapter-service/adapter.service';
export type { SkyFocusableChildrenOptions } from './lib/modules/adapter-service/focusable-children-options';

export { SkyAffixAutoFitContext } from './lib/modules/affix/affix-auto-fit-context';
export type { SkyAffixConfig } from './lib/modules/affix/affix-config';
export type { SkyAffixHorizontalAlignment } from './lib/modules/affix/affix-horizontal-alignment';
export type { SkyAffixOffset } from './lib/modules/affix/affix-offset';
export type { SkyAffixOffsetChange } from './lib/modules/affix/affix-offset-change';
export type { SkyAffixPlacement } from './lib/modules/affix/affix-placement';
export type { SkyAffixPlacementChange } from './lib/modules/affix/affix-placement-change';
export type { SkyAffixPosition } from './lib/modules/affix/affix-position';
export type { SkyAffixVerticalAlignment } from './lib/modules/affix/affix-vertical-alignment';
export { SkyAffixModule } from './lib/modules/affix/affix.module';
export { SkyAffixService } from './lib/modules/affix/affix.service';
export { SkyAffixer } from './lib/modules/affix/affixer';

export type { SkyContentInfo } from './lib/modules/content-info-provider/content-info';
export type { SkyContentInfoDescriptor } from './lib/modules/content-info-provider/content-info-descriptor';
export { SkyContentInfoProvider } from './lib/modules/content-info-provider/content-info-provider';

export { SkyDefaultInputProvider } from './lib/modules/default-input-provider/default-input-provider';

export type { SkyDockInsertComponentConfig } from './lib/modules/dock/dock-insert-component-config';
export { SkyDockItem } from './lib/modules/dock/dock-item';
export type { SkyDockItemConfig } from './lib/modules/dock/dock-item-config';
export { SkyDockLocation } from './lib/modules/dock/dock-location';
export type { SkyDockOptions } from './lib/modules/dock/dock-options';
export { SkyDockModule } from './lib/modules/dock/dock.module';
export { SkyDockService } from './lib/modules/dock/dock.service';

export { SkyDynamicComponentLocation } from './lib/modules/dynamic-component/dynamic-component-location';
export type { SkyDynamicComponentOptions } from './lib/modules/dynamic-component/dynamic-component-options';
export { SkyDynamicComponentModule } from './lib/modules/dynamic-component/dynamic-component.module';
export {
  SkyDynamicComponentLegacyService,
  SkyDynamicComponentService,
} from './lib/modules/dynamic-component/dynamic-component.service';

export { SkyFileReaderService } from './lib/modules/file-reader/file-reader.service';

export { SkyAppFormat } from './lib/modules/format/app-format';

export type { SkyHelpGlobalOptions } from './lib/modules/help/help-global-options';
export { SKY_HELP_GLOBAL_OPTIONS } from './lib/modules/help/help-global-options-token';
export type { SkyHelpOpenArgs } from './lib/modules/help/help-open-args';
export type { SkyHelpUpdateArgs } from './lib/modules/help/help-update-args';
export { SkyHelpService } from './lib/modules/help/help.service';

export { SkyIdModule } from './lib/modules/id/id.module';
export { SkyIdService } from './lib/modules/id/id.service';

export type { SkyLayoutHostForChildArgs } from './lib/modules/layout-host/layout-host-for-child-args';
export { SkyLayoutHostDirective } from './lib/modules/layout-host/layout-host.directive';
export { SkyLayoutHostService } from './lib/modules/layout-host/layout-host.service';

export { SkyLiveAnnouncerService } from './lib/modules/live-announcer/live-announcer.service';
export type { SkyLiveAnnouncerArgs } from './lib/modules/live-announcer/types/live-announcer-args';
export type { SkyLiveAnnouncerPoliteness } from './lib/modules/live-announcer/types/live-announcer-politeness';

export { SkyLogModule } from './lib/modules/log/log.module';
export { SkyLogService } from './lib/modules/log/log.service';
export { SkyLogLevel } from './lib/modules/log/types/log-level';
export { SKY_LOG_LEVEL } from './lib/modules/log/types/log-level-token';

export type { SkyBreakpoint } from './lib/modules/breakpoint-observer/breakpoint';
export { SKY_BREAKPOINTS } from './lib/modules/breakpoint-observer/breakpoint';
export type { SkyBreakpointObserver } from './lib/modules/breakpoint-observer/breakpoint-observer';
export { SKY_BREAKPOINT_OBSERVER } from './lib/modules/breakpoint-observer/breakpoint-observer.token';
export { SkyContainerBreakpointObserver } from './lib/modules/breakpoint-observer/container-breakpoint-observer';
export { SkyMediaBreakpointObserver } from './lib/modules/breakpoint-observer/media-breakpoint-observer';
export { provideSkyBreakpointObserver } from './lib/modules/breakpoint-observer/provide-breakpoint-observer';
export { SkyResponsiveHostDirective } from './lib/modules/breakpoint-observer/responsive-host.directive';
export { SkyMediaBreakpoints } from './lib/modules/media-query/media-breakpoints';
export type { SkyMediaQueryListener } from './lib/modules/media-query/media-query-listener';
export { SkyMediaQueryModule } from './lib/modules/media-query/media-query.module';
export { SkyMediaQueryService } from './lib/modules/media-query/media-query.service';

export { SkyMutationObserverService } from './lib/modules/mutation/mutation-observer-service';

export type { SkyNumericSymbol } from './lib/modules/numeric/numeric-symbol';
export { SkyNumericModule } from './lib/modules/numeric/numeric.module';
export type { SkyNumericOptions } from './lib/modules/numeric/numeric.options';
export { NumericOptions } from './lib/modules/numeric/numeric.options';
export { SkyNumericPipe } from './lib/modules/numeric/numeric.pipe';
export { SkyNumericService } from './lib/modules/numeric/numeric.service';

export type { SkyOverlayConfig } from './lib/modules/overlay/overlay-config';
export { SkyOverlayInstance } from './lib/modules/overlay/overlay-instance';
export type { SkyOverlayPosition } from './lib/modules/overlay/overlay-position';
export { SkyOverlayModule } from './lib/modules/overlay/overlay.module';
export {
  SkyOverlayLegacyService,
  SkyOverlayService,
} from './lib/modules/overlay/overlay.service';

export { SkyPercentPipeModule } from './lib/modules/percent-pipe/percent-pipe.module';
export { SkyPercentPipe } from './lib/modules/percent-pipe/percent.pipe';

export { SkyResizeObserverMediaQueryService } from './lib/modules/resize-observer/resize-observer-media-query.service';
export { SkyResizeObserverService } from './lib/modules/resize-observer/resize-observer.service';

export { SkyScreenReaderLabelDirective } from './lib/modules/screen-reader-label/screen-reader-label.directive';

export type { SkyScrollShadowEventArgs } from './lib/modules/scroll-shadow/scroll-shadow-event-args';
export { SkyScrollShadowDirective } from './lib/modules/scroll-shadow/scroll-shadow.directive';

export { SkyScrollableHostService } from './lib/modules/scrollable-host/scrollable-host.service';

export type { SkyStackingContext } from './lib/modules/stacking-context/stacking-context';
export { SKY_STACKING_CONTEXT } from './lib/modules/stacking-context/stacking-context-token';

export type { SkyAppSetTitleArgs } from './lib/modules/title/set-title-args';
export { SkyAppTitleService } from './lib/modules/title/title.service';

export { SkyTrimModule } from './lib/modules/trim/trim.module';

export { SkyUIConfigService } from './lib/modules/ui-config/ui-config.service';

export { SkyViewkeeper } from './lib/modules/viewkeeper/viewkeeper';
export { SkyViewkeeperHostOptions } from './lib/modules/viewkeeper/viewkeeper-host-options';
export type { SkyViewkeeperOptions } from './lib/modules/viewkeeper/viewkeeper-options';
export { SkyViewkeeperModule } from './lib/modules/viewkeeper/viewkeeper.module';
export { SkyViewkeeperService } from './lib/modules/viewkeeper/viewkeeper.service';

export { SkyAppWindowRef } from './lib/modules/window/window-ref';

export { VERSION } from './version';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyAffixDirective as λ1 } from './lib/modules/affix/affix.directive';
export { SkyIdDirective as λ2 } from './lib/modules/id/id.directive';
export { SkyTrimDirective as λ4 } from './lib/modules/trim/trim.directive';
export { SkyViewkeeperDirective as λ3 } from './lib/modules/viewkeeper/viewkeeper.directive';
