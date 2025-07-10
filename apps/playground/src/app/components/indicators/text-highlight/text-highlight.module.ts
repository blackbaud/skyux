import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyTextHighlightModule } from '@skyux/indicators';

import { TextHighlightRoutingModule } from './text-highlight-routing.module';
import { TextHighlightComponent } from './text-highlight.component';

@NgModule({
  declarations: [TextHighlightComponent],
  imports: [
    TextHighlightRoutingModule,
    SkyTextHighlightModule,
    FormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
  ],
})
export class TextHighlightModule {
  public static routes = TextHighlightRoutingModule.routes;
}
