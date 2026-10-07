import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * @title Buttons in toolbar
 */
@Component({
  selector: 'app-forms-button-toolbar-example',
  templateUrl: './example.html',
  imports: [SkyButton, SkyToolbarModule],
})
export class FormsButtonToolbarExample {}
