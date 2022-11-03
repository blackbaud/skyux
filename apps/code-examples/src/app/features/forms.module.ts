import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacterCountDemoComponent } from '../code-examples/forms/character-count/character-count-demo.component';
import { SkyCharacterCountDemoModule } from '../code-examples/forms/character-count/character-count-demo.module';
import { CheckboxDemoComponent as CheckboxBasicDemoComponent } from '../code-examples/forms/checkbox/basic/checkbox-demo.component';
import { CheckboxDemoModule as CheckboxBasicDemoModule } from '../code-examples/forms/checkbox/basic/checkbox-demo.module';
import { CheckboxDemoComponent as CheckboxIconGroupDemoComponent } from '../code-examples/forms/checkbox/icon-group/checkbox-demo.component';
import { CheckboxDemoModule as CheckboxIconGroupDemoModule } from '../code-examples/forms/checkbox/icon-group/checkbox-demo.module';
import { CheckboxDemoComponent as InlineHelpCheckboxDemoComponent } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.component';
import { CheckboxDemoModule as InlineHelpCheckboxDemoModule } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.module';
import { FileAttachmentDemoComponent } from '../code-examples/forms/file-attachment/basic/file-attachment-demo.component';
import { SkyFileAttachmentDemoModule } from '../code-examples/forms/file-attachment/basic/file-attachment-demo.module';
import { InputBoxDemoComponent } from '../code-examples/forms/input-box/basic/input-box-demo.component';
import { InputBoxDemoModule } from '../code-examples/forms/input-box/basic/input-box-demo.module';
import { RadioDemoComponent as IconRadioDemoComponent } from '../code-examples/forms/radio/icon/radio-demo.component';
import { SkyRadioDemoModule as IconHelpRadioDemoModule } from '../code-examples/forms/radio/icon/radio-demo.module';
import { RadioDemoComponent as InlineHelpRadioDemoComponent } from '../code-examples/forms/radio/inline-help/radio-demo.component';
import { RadioDemoModule as InlineHelpRadioDemoModule } from '../code-examples/forms/radio/inline-help/radio-demo.module';
import { RadioDemoComponent as StandardRadioDemoComponent } from '../code-examples/forms/radio/standard/radio-demo.component';
import { SkyRadioDemoModule as StandardRadioDemoModule } from '../code-examples/forms/radio/standard/radio-demo.module';
import { SelectionBoxDemoComponent as SelectionBoxCheckboxDemoComponent } from '../code-examples/forms/selection-box/checkbox/selection-box-demo.component';
import { SkySelectionBoxDemoModule as SelectionBoxCheckboxDemoModule } from '../code-examples/forms/selection-box/checkbox/selection-box-demo.module';
import { SelectionBoxDemoComponent as SelectionBoxRadioDemoComponent } from '../code-examples/forms/selection-box/radio/selection-box-demo.component';
import { SkySelectionBoxDemoModule as SelectionBoxRadioDemoModule } from '../code-examples/forms/selection-box/radio/selection-box-demo.module';
import { SingleFileAttachmentDemoComponent as BasicSingleFileAttachmentDemoComponent } from '../code-examples/forms/single-file-attachment/basic/single-file-attachment-demo.component';
import { SkySingleFileAttachmentDemoModule as BasicSkySingleFileAttachmentDemoModule } from '../code-examples/forms/single-file-attachment/basic/single-file-attachment-demo.module';
import { SingleFileAttachmentDemoComponent as InlineHelpSingleFileAttachmentDemoComponent } from '../code-examples/forms/single-file-attachment/inline-help/single-file-attachment-demo.component';
import { SkySingleFileAttachmentDemoModule as InlineHelpSkySingleFileAttachmentDemoModule } from '../code-examples/forms/single-file-attachment/inline-help/single-file-attachment-demo.module';
import { ToggleSwitchDemoComponent } from '../code-examples/forms/toggle-switch/basic/toggle-switch-demo.component';
import { SkyToggleSwitchDemoModule } from '../code-examples/forms/toggle-switch/basic/toggle-switch-demo.module';
import { ToggleSwitchDemoComponent as InlineHelpToggleSwitchComponent } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.component';
import { SkyToggleSwitchDemoModule as InlineHelpToggleSwitchModule } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.module';

const routes: Routes = [
  {
    path: 'character-count',
    component: CharacterCountDemoComponent,
  },
  {
    path: 'checkbox/basic',
    component: CheckboxBasicDemoComponent,
  },
  {
    path: 'checkbox/icon-group',
    component: CheckboxIconGroupDemoComponent,
  },
  {
    path: 'checkbox/inline-help',
    component: InlineHelpCheckboxDemoComponent,
  },
  {
    path: 'file-attachment/basic',
    component: FileAttachmentDemoComponent,
  },
  {
    path: 'input-box/basic',
    component: InputBoxDemoComponent,
  },
  {
    path: 'radio/icon',
    component: IconRadioDemoComponent,
  },
  {
    path: 'radio/inline-help',
    component: InlineHelpRadioDemoComponent,
  },
  {
    path: 'radio/standard',
    component: StandardRadioDemoComponent,
  },
  {
    path: 'selection-box/checkbox',
    component: SelectionBoxCheckboxDemoComponent,
  },
  {
    path: 'selection-box/radio',
    component: SelectionBoxRadioDemoComponent,
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
    path: 'toggle-switch/basic',
    component: ToggleSwitchDemoComponent,
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
    BasicSkySingleFileAttachmentDemoModule,
    InlineHelpSkySingleFileAttachmentDemoModule,
    InlineHelpRadioDemoModule,
    InlineHelpToggleSwitchModule,
    InputBoxDemoModule,
    SelectionBoxCheckboxDemoModule,
    SelectionBoxRadioDemoModule,
    CheckboxIconGroupDemoModule,
    SkyFileAttachmentDemoModule,
    IconHelpRadioDemoModule,
    StandardRadioDemoModule,
    SkyToggleSwitchDemoModule,
    SkyCharacterCountDemoModule,
  ],
})
export class FormsModule {}
