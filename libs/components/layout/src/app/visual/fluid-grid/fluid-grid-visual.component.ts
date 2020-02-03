import {
  Component
} from '@angular/core';

import {
  SkyFluidGridGutterSize
} from '../../public';

@Component({
  selector: 'fluid-grid-visual',
  templateUrl: './fluid-grid-visual.component.html',
  styles: [`
    .sky-column {
      background-color: #97eced;
      border: 1px solid #56e0e1;
    }`]
})
export class FluidGridVisualComponent {

  public disableMargin: boolean = false;

  public gutterSize: SkyFluidGridGutterSize = SkyFluidGridGutterSize.Large;

  public gutterSizes: SkyFluidGridGutterSize[] = [
    SkyFluidGridGutterSize.Small,
    SkyFluidGridGutterSize.Medium,
    SkyFluidGridGutterSize.Large
  ];

  public getEnumName(key: number): string {
    return SkyFluidGridGutterSize[key];
  }

}
