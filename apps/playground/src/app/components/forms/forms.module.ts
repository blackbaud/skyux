import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'character-counter',
    loadChildren: () =>
      import('./character-counter/character-counter.module').then(
        (m) => m.CharacterCounterModule,
      ),
  },
  {
    path: 'input-box',
    loadChildren: () =>
      import('./input-box/input-box.module').then((m) => m.InputBoxModule),
  },
  {
    path: 'radio',
    loadChildren: () =>
      import('./radio/radio.module').then((m) => m.RadioModule),
  },
  {
    path: 'toggle-switch',
    loadChildren: () =>
      import('./toggle-switch/toggle-switch.module').then(
        (m) => m.ToggleSwitchModule,
      ),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('./checkbox/checkbox.module').then((m) => m.CheckboxModule),
  },
  {
    path: 'field-group',
    loadChildren: () =>
      import('./field-group/field-group.module').then(
        (m) => m.FieldGroupModule,
      ),
  },
  {
    path: 'file-attachment',
    loadChildren: () =>
      import('./file-attachment/file-attachment.module').then(
        (m) => m.FileAttachmentModule,
      ),
  },
  {
    path: 'single-file-attachment',
    loadChildren: () =>
      import('./single-file-attachment/single-file-attachment.module').then(
        (m) => m.SingleFileAttachmentModule,
      ),
  },
  {
    path: 'single-file-attachment',
    loadChildren: () =>
      import('./single-file-attachment/single-file-attachment.module').then(
        (m) => m.SingleFileAttachmentModule,
      ),
  },
  {
    path: 'selection-box',
    loadChildren: () =>
      import('./selection-box/selection-box.module').then(
        (m) => m.SelectionBoxModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}

@NgModule({
  imports: [FormsRoutingModule],
})
export class FormsModule {
  public static routes = routes;
}
