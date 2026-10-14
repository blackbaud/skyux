import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SkyButton } from '@skyux/forms';

import { SectionedFormComponent } from './sectioned-form.component';

const routes: Route[] = [{ path: '', component: SectionedFormComponent }];
@NgModule({
  declarations: [SectionedFormComponent],
  imports: [SkyButton, RouterModule.forChild(routes)],
  exports: [SectionedFormComponent],
})
export class SectionedFormModule {}
