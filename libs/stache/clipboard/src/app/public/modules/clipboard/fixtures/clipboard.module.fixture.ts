import {
  NgModule
} from '@angular/core';
import { SkyClipboardModule } from '../clipboard.module';
import { SkyClipboardTestComponent } from './clipboard.component.fixture';

@NgModule({
  declarations: [
    SkyClipboardTestComponent
  ],
  imports: [
    SkyClipboardModule
  ]
})
export class SkyClipboardTestModule { }
