import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyCoreAdapterModule, SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTabsModule } from '@skyux/tabs';
import { SkyThemeModule } from '@skyux/theme';

import { SkyTextEditorResourcesModule } from '../../modules/shared/sky-text-editor-resources.module';

import { SkyTextEditorMenubarComponent } from './menubar/text-editor-menubar.component';
import { SkyTextEditorComponent } from './text-editor.component';
import { SkyTextEditorToolbarComponent } from './toolbar/text-editor-toolbar.component';
import { SkyTextEditorUrlModalComponent } from './url-modal/text-editor-url-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCoreAdapterModule,
    SkyTextEditorResourcesModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyColorpickerModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyModalModule,
    SkyTabsModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
  exports: [
    SkyTextEditorComponent,
    SkyTextEditorUrlModalComponent,
    SkyTextEditorToolbarComponent,
    SkyTextEditorMenubarComponent,
  ],
  declarations: [
    SkyTextEditorComponent,
    SkyTextEditorUrlModalComponent,
    SkyTextEditorToolbarComponent,
    SkyTextEditorMenubarComponent,
  ],
})
export class SkyTextEditorModule {}
