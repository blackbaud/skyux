import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyTextHighlightModule } from '@skyux/indicators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyTextHighlightModule,
  ],
})
export class DemoComponent {
  protected searchTerm = '';
  protected showAdditionalContent = false;
}
