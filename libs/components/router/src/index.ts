export type { SkyAppLinkQueryParams } from './lib/modules/link/link-query-params';
export { SkyAppLinkModule } from './lib/modules/link/link.module';

export type { SkyHrefResolver } from './lib/modules/href/href-resolver';
export { SkyHrefResolverService } from './lib/modules/href/href-resolver.service';
export { SkyHrefModule } from './lib/modules/href/href.module';
export type { SkyHref } from './lib/modules/href/types/href';
export type { SkyHrefChange } from './lib/modules/href/types/href-change';
export type { SkyHrefQueryParams } from './lib/modules/href/types/href-query-params';
export type { SkyHrefResolverArgs } from './lib/modules/href/types/href-resolver.args';

export type { SkyRecentlyAccessedAddLinkArgs } from './lib/modules/recently-accessed/recently-accessed-add-link-args';
export type { SkyRecentlyAccessedAddLinkResult } from './lib/modules/recently-accessed/recently-accessed-add-link-result';
export type { SkyRecentlyAccessedAddRouteArgs } from './lib/modules/recently-accessed/recently-accessed-add-route-args';
export type { SkyRecentlyAccessedGetLinksArgs } from './lib/modules/recently-accessed/recently-accessed-get-links-args';
export type { SkyRecentlyAccessedLink } from './lib/modules/recently-accessed/recently-accessed-link';
export type { SkyRecentlyAccessedLinkList } from './lib/modules/recently-accessed/recently-accessed-link-list';
export { SkyRecentlyAccessedService } from './lib/modules/recently-accessed/recently-accessed.service';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of public API.
export { SkyHrefDirective as λ1 } from './lib/modules/href/href.directive';
export { SkyAppLinkExternalDirective as λ2 } from './lib/modules/link/link-external.directive';
export { SkyAppLinkDirective as λ3 } from './lib/modules/link/link.directive';
