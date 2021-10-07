export * from './modules/help/help.module';

export * from './modules/help-directive/disable.module';

export * from './modules/help-key/help-key.module';

export * from './modules/open-on-click-directive/open-on-click.module';

export * from './modules/shared/initialization.service';
export * from './modules/shared/widget.service';
export * from './modules/shared/widget-config';

export * from './bb-help.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of public API.
export { HelpComponent as λ1 } from './modules/help/help.component';
export { BBHelpDisableWidgetDirective as λ2 } from './modules/help-directive/disable.directive';
export { HelpKeyComponent as λ3 } from './modules/help-key/help-key.component';
export { BBHelpOpenOnClickDirective as λ4 } from './modules/open-on-click-directive/open-on-click.directive';
