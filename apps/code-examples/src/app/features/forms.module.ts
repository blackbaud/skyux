import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckboxDemoComponent as CheckboxBasicDemoComponent } from '../code-examples/forms/checkbox/basic/checkbox-demo.component';
import { CheckboxDemoModule as CheckboxBasicDemoModule } from '../code-examples/forms/checkbox/basic/checkbox-demo.module';
import { CheckboxDemoComponent as InlineHelpCheckboxDemoComponent } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.component';
import { CheckboxDemoModule as InlineHelpCheckboxDemoModule } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.module';
import { FileAttachmentDemoComponent as InlineHelpFileAttachmentDemoComponent } from '../code-examples/forms/file-attachment/inline-help/file-attachment-demo.component';
import { SkyFileAttachmentDemoModule as InlineHelpSkyFileAttachmentDemoModule } from '../code-examples/forms/file-attachment/inline-help/file-attachment-demo.module';
import { RadioDemoComponent as InlineHelpRadioDemoComponent } from '../code-examples/forms/radio/inline-help/radio-demo.component';
import { RadioDemoModule as InlineHelpRadioDemoModule } from '../code-examples/forms/radio/inline-help/radio-demo.module';
import { SingleFileAttachmentDemoComponent as BasicSingleFileAttachmentDemoComponent } from '../code-examples/forms/single-file-attachment/basic/single-file-attachment-demo.component';
import { SkySingleFileAttachmentDemoModule as BasicSkySingleFileAttachmentDemoModule } from '../code-examples/forms/single-file-attachment/basic/single-file-attachment-demo.module';
import { SingleFileAttachmentDemoComponent as InlineHelpSingleFileAttachmentDemoComponent } from '../code-examples/forms/single-file-attachment/inline-help/single-file-attachment-demo.component';
import { SkySingleFileAttachmentDemoModule as InlineHelpSkySingleFileAttachmentDemoModule } from '../code-examples/forms/single-file-attachment/inline-help/single-file-attachment-demo.module';
import { ToggleSwitchDemoComponent as InlineHelpToggleSwitchComponent } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.component';
import { SkyToggleSwitchDemoModule as InlineHelpToggleSwitchModule } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.module';

const routes: Routes = [
  {
    path: 'checkbox/basic',
    component: CheckboxBasicDemoComponent,
  },
  {
    path: 'radio/inline-help',
    component: InlineHelpRadioDemoComponent,
  },
  {
    path: 'checkbox/inline-help',
    component: InlineHelpCheckboxDemoComponent,
  },
  {
    path: 'file-attachment/inline-help',
    component: InlineHelpFileAttachmentDemoComponent,
  },
  {
    path: 'single-file-attachment/basic',
    component: BasicSingleFileAttachmentDemoComponent,
  },
  {
    path: 'single-file-attachment/inline-help',
    component: InlineHelpSingleFileAttachmentDemoComponent,
  },
  {
    path: 'toggle-switch/inline-help',
    component: InlineHelpToggleSwitchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}

@NgModule({
  imports: [
    CheckboxBasicDemoModule,
    FormsRoutingModule,
    InlineHelpCheckboxDemoModule,
    InlineHelpSkyFileAttachmentDemoModule,
    BasicSkySingleFileAttachmentDemoModule,
    InlineHelpSkySingleFileAttachmentDemoModule,
    InlineHelpRadioDemoModule,
    InlineHelpToggleSwitchModule,
  ],
})
export class FormsModule {}
