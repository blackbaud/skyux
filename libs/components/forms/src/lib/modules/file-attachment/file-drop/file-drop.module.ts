import { NgModule } from '@angular/core';

import { SkyFormErrorModule } from '../../form-error/form-error.module';

import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileItemComponent } from './file-item.component';

/**
 * @docsIncludeIds SkyFileDropComponent, SkyFileItemComponent, SkyFileDropChange, SkyFileLink, SkyFileItem, SkyFileValidateFn, SkyFileDropHarness, SkyFileItemHarness, SkyFileItemHarnessFilters, provideSkyFileAttachmentTesting, FormsFileDropBasicExampleComponent, FormsFileDropHelpKeyExampleComponent
 */
@NgModule({
  exports: [SkyFileDropComponent, SkyFileItemComponent, SkyFormErrorModule],
  imports: [SkyFileDropComponent, SkyFileItemComponent],
})
export class SkyFileDropModule {}
