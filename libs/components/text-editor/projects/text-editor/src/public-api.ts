export * from './modules/rich-text-display/rich-text-display.module';

export * from './modules/text-editor/types/font-state';
export * from './modules/text-editor/types/menu-type';
export * from './modules/text-editor/types/style-state';
export * from './modules/text-editor/types/text-editor-merge-field';
export * from './modules/text-editor/types/toolbar-action-type';

export * from './modules/text-editor/text-editor.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyRichTextDisplayComponent as λ1 } from './modules/rich-text-display/rich-text-display.component';
export { SkyTextEditorMenubarComponent as λ2 } from './modules/text-editor/menubar/text-editor-menubar.component';
export { SkyTextEditorUrlModalComponent as λ3 } from './modules/text-editor/url-modal/text-editor-url-modal.component';
export { SkyTextEditorToolbarComponent as λ4 } from './modules/text-editor/toolbar/text-editor-toolbar.component';
export { SkyTextEditorComponent as λ5 } from './modules/text-editor/text-editor.component';
