import { NgModule } from '@angular/core';
import { SkyRichTextDisplayModule } from '@skyux/text-editor';

import { RichTextDisplayRoutingModule } from './rich-text-display-routing.module';
import { RichTextDisplayComponent } from './rich-text-display.component';

@NgModule({
  declarations: [RichTextDisplayComponent],
  imports: [RichTextDisplayRoutingModule, SkyRichTextDisplayModule],
})
export class RichTextDisplayModule {
  public static routes = RichTextDisplayRoutingModule.routes;
}
