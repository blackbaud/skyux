import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

/**
 * @title Box with header, content, and controls
 */
@Component({
  selector: 'app-layout-box-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyBoxModule, SkyDropdownModule],
})
export class LayoutBoxBasicExampleComponent {}
