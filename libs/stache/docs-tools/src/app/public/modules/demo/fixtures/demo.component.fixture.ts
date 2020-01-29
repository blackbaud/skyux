import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelRadioChoice
} from '../demo-control-panel-radio-choice';

@Component({
  selector: 'demo-fixture',
  templateUrl: './demo.component.fixture.html'
})
export class DemoFixtureComponent {

  public backgroundColors: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: '#f00', label: 'Red' },
    { value: '#0f0', label: 'Green' },
    { value: '#00f', label: 'Blue' }
  ];

  public demoSettings: {
    backgroundColor?: string;
    showIcon?: boolean;
  } = {};

  public onDemoReset(): void { }

  public onDemoSelectionChange(): void { }

}
