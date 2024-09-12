import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyPopoverModule } from '@skyux/popovers';

import { AffixRoutingModule } from './affix-routing.module';
import { AffixComponent } from './affix.component';

const routes: Routes = [{ path: '', component: AffixComponent }];

@NgModule({
  declarations: [AffixComponent],
  imports: [RouterModule.forChild(routes), SkyPopoverModule],
})
export class AffixModule {
  public static routes = AffixRoutingModule.routes;
}
