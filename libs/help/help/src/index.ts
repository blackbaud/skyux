export * from './lib/modules/help/help.module';

export * from './lib/modules/help-directive/disable.module';

export * from './lib/modules/help-key/help-key.module';

export * from './lib/modules/open-on-click-directive/open-on-click.module';

export * from './lib/modules/shared/initialization.service';
export * from './lib/modules/shared/widget.service';
export * from './lib/modules/shared/widget-config';

export * from './lib/bb-help.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of public API.
export { HelpComponent as λ1 } from './lib/modules/help/help.component';
export { BBHelpDisableWidgetDirective as λ2 } from './lib/modules/help-directive/disable.directive';
export { HelpKeyComponent as λ3 } from './lib/modules/help-key/help-key.component';
export { BBHelpOpenOnClickDirective as λ4 } from './lib/modules/open-on-click-directive/open-on-click.directive';
