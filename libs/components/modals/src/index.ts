export type { SkyConfirmButtonAction } from './lib/modules/confirm/confirm-button-action';
export type { SkyConfirmButtonConfig } from './lib/modules/confirm/confirm-button-config';
export type { SkyConfirmButtonStyleType } from './lib/modules/confirm/confirm-button-style-type';
export type { SkyConfirmCloseEventArgs } from './lib/modules/confirm/confirm-closed-event-args';
export type { SkyConfirmConfig } from './lib/modules/confirm/confirm-config';
export { SkyConfirmInstance } from './lib/modules/confirm/confirm-instance';
export type { SkyConfirmServiceInterface } from './lib/modules/confirm/confirm-service-interface';
export { SkyConfirmType } from './lib/modules/confirm/confirm-type';
export { SkyConfirmModule } from './lib/modules/confirm/confirm.module';
export { SkyConfirmService } from './lib/modules/confirm/confirm.service';

export { SkyModalBeforeCloseHandler } from './lib/modules/modal/modal-before-close-handler';
export { SkyModalCloseArgs } from './lib/modules/modal/modal-close-args';
export { SkyModalConfiguration } from './lib/modules/modal/modal-configuration';
export type { SkyModalError } from './lib/modules/modal/modal-error';
export { SkyModalErrorsService } from './lib/modules/modal/modal-errors.service';
export { SkyModalHostService } from './lib/modules/modal/modal-host.service';
export { SkyModalInstance } from './lib/modules/modal/modal-instance';
export type { SkyModalServiceInterface } from './lib/modules/modal/modal-service-interface';
export type { SkyModalConfigurationInterface } from './lib/modules/modal/modal.interface';
export { SkyModalModule } from './lib/modules/modal/modal.module';
export {
  SkyModalLegacyService,
  SkyModalService,
} from './lib/modules/modal/modal.service';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyConfirmComponent as λ1 } from './lib/modules/confirm/confirm.component';
export { SkyModalContentComponent as λ2 } from './lib/modules/modal/modal-content.component';
export { SkyModalFooterComponent as λ3 } from './lib/modules/modal/modal-footer.component';
export { SkyModalHeaderComponent as λ4 } from './lib/modules/modal/modal-header.component';
export { SkyModalIsDirtyDirective as λ6 } from './lib/modules/modal/modal-is-dirty.directive';
export { SkyModalComponent as λ5 } from './lib/modules/modal/modal.component';
