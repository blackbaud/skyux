import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SectionedFormComponent } from './sectioned-form.component';

const routes: Route[] = [{ path: '', component: SectionedFormComponent }];
@NgModule({
  declarations: [SectionedFormComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [SectionedFormComponent],
})
export class SectionedFormModule {}
