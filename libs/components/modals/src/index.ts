// TODO: confirm-button is internal and should be removed in a future version
export * from './lib/modules/confirm/confirm-button';
export * from './lib/modules/confirm/confirm-button-action';
export * from './lib/modules/confirm/confirm-button-config';
export * from './lib/modules/confirm/confirm-closed-event-args';
export * from './lib/modules/confirm/confirm-config';
export * from './lib/modules/confirm/confirm-instance';
export * from './lib/modules/confirm/confirm-type';
export * from './lib/modules/confirm/confirm.module';
export * from './lib/modules/confirm/confirm.service';

export * from './lib/modules/modal/modal-before-close-handler';
export * from './lib/modules/modal/modal-close-args';
export * from './lib/modules/modal/modal-configuration';
export * from './lib/modules/modal/modal-host.service';
export * from './lib/modules/modal/modal-instance';
export * from './lib/modules/modal/modal.interface';
export * from './lib/modules/modal/modal.module';
export * from './lib/modules/modal/modal.service';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyConfirmComponent as λ1 } from './lib/modules/confirm/confirm.component';
export { SkyModalContentComponent as λ2 } from './lib/modules/modal/modal-content.component';
export { SkyModalFooterComponent as λ3 } from './lib/modules/modal/modal-footer.component';
export { SkyModalHeaderComponent as λ4 } from './lib/modules/modal/modal-header.component';
export { SkyModalComponent as λ5 } from './lib/modules/modal/modal.component';
