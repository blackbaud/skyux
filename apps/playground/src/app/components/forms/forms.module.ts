import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
        (m) => m.ToggleSwitchModule
      ),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('./checkbox/checkbox.module').then((m) => m.CheckboxModule),
  },
  {
    path: 'file-attachment',
    loadChildren: () =>
      import('./file-attachment/file-attachment.module').then(
        (m) => m.FileAttachmentModule
      ),
  },
  {
    path: 'single-file-attachment',
    loadChildren: () =>
      import('./single-file-attachment/single-file-attachment.module').then(
        (m) => m.SingleFileAttachmentModule
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
