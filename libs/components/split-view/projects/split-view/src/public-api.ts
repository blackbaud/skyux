// Split view modules.
export * from './modules/split-view/split-view.module';

// Split view types.
export * from './modules/split-view/types/split-view-message';
export * from './modules/split-view/types/split-view-message-type';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export {SkySplitViewComponent as λ1} from './modules/split-view/split-view.component';
export {SkySplitViewDrawerComponent as λ2} from './modules/split-view/split-view-drawer.component';
export {SkySplitViewWorkspaceComponent as λ3} from './modules/split-view/split-view-workspace.component';
export {SkySplitViewWorkspaceContentComponent as λ4} from './modules/split-view/split-view-workspace-content.component';
export {SkySplitViewWorkspaceFooterComponent as λ5} from './modules/split-view/split-view-workspace-footer.component';
export {SkySplitViewWorkspaceHeaderComponent as λ6} from './modules/split-view/split-view-workspace-header.component';
