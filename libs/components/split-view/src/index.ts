// Split view modules.
export { SkySplitViewModule } from './lib/modules/split-view/split-view.module';

// Split view types.
export type { SkySplitViewDockType } from './lib/modules/split-view/types/split-view-dock-type';
export type { SkySplitViewMessage } from './lib/modules/split-view/types/split-view-message';
export { SkySplitViewMessageType } from './lib/modules/split-view/types/split-view-message-type';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkySplitViewDrawerComponent as λ2 } from './lib/modules/split-view/split-view-drawer.component';
export { SkySplitViewWorkspaceContentComponent as λ4 } from './lib/modules/split-view/split-view-workspace-content.component';
export { SkySplitViewWorkspaceFooterComponent as λ5 } from './lib/modules/split-view/split-view-workspace-footer.component';
export { SkySplitViewWorkspaceHeaderComponent as λ6 } from './lib/modules/split-view/split-view-workspace-header.component';
export { SkySplitViewWorkspaceComponent as λ3 } from './lib/modules/split-view/split-view-workspace.component';
export { SkySplitViewComponent as λ1 } from './lib/modules/split-view/split-view.component';
