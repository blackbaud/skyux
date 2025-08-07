import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyTextHighlightModule } from '@skyux/indicators';

/**
 * @title Text highlight with basic setup
 */
@Component({
  selector: 'app-indicators-text-highlight-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyTextHighlightModule,
  ],
})
export class IndicatorsTextHighlightBasicExampleComponent {
  protected searchTerm = '';
  protected showAdditionalContent = false;
}
