import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'input-box',
    loadChildren: () =>
      import('./input-box/input-box.module').then((m) => m.InputBoxModule),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('./checkbox/checkbox.module').then((m) => m.CheckboxModule),
  },
  {
    path: 'radio-button',
    loadChildren: () =>
      import('./radio-button/radio-button.module').then(
        (m) => m.RadioButtonModule
      ),
  },
  {
    path: 'toggle-switch',
    loadChildren: () =>
      import('./toggle-switch/toggle-switch.module').then(
        (m) => m.ToggleSwitchModule
      ),
  },
  {
    path: 'character-counter',
    loadChildren: () =>
      import('./character-counter/character-counter.module').then(
        (m) => m.CharacterCounterModule
      ),
  },
  {
    path: 'single-file-attachment',
    loadChildren: () =>
      import('./single-file-attachment/single-file-attachment.module').then(
        (m) => m.SingleFileAttachmentModule
      ),
  },
  {
    path: 'file-attachment',
    loadChildren: () =>
      import('./file-attachment/file-attachment.module').then(
        (m) => m.FileAttachmentModule
      ),
  },
  {
    path: 'selection-box',
    loadChildren: () =>
      import('./selection-box/selection-box.module').then(
        (m) => m.SelectionBoxModule
      ),
  },
];
if (routes.length > 0 && routes.findIndex((r) => r.path === '') === -1) {
  routes.push({ path: '', redirectTo: `${routes[0].path}`, pathMatch: 'full' });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
