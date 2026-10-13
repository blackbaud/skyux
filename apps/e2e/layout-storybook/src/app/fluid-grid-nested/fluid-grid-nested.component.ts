import { Component } from '@angular/core';
import { SkyFluidGridGutterSizeType, SkyFluidGridModule } from '@skyux/layout';

@Component({
  imports: [SkyFluidGridModule],
  selector: 'app-fluid-grid-nested',
  templateUrl: './fluid-grid-nested.component.html',
  styleUrls: ['./fluid-grid-nested.component.scss'],
})
export class FluidGridNestedComponent {
  protected readonly gutterSizes: SkyFluidGridGutterSizeType[] = [
    'small',
    'medium',
    'large',
  ];
}
