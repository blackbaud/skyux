import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';
import { SkyAppLinkModule } from '@skyux/router';

import { DropdownVisualComponent } from './dropdown/dropdown-visual.component';
import { PopoverVisualComponent } from './popover/popover-visual.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    DropdownVisualComponent,
    PopoverVisualComponent,
    VisualComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SkyAppLinkModule,
    SkyDropdownModule,
    SkyPopoverModule,
  ],
})
export class VisualModule {}
