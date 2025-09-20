import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'colorpicker',
    loadChildren: () =>
      import('./colorpicker/colorpicker.module').then(
        (m) => m.ColorpickerModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorpickerRoutingModule {}

@NgModule({
  imports: [ColorpickerRoutingModule],
})
export class ColorpickerModule {
  public static routes = routes;
}
