import { Component, ViewChild } from '@angular/core';

import { SkyDocsDemoContentAlignment } from '../demo-content-alignment';
import { SkyDocsDemoControlPanelChange } from '../demo-control-panel-change';
import { SkyDocsDemoControlPanelRadioChoice } from '../demo-control-panel-radio-choice';
import { SkyDocsDemoControlPanelComponent } from '../demo-control-panel.component';
import { SkyDocsDemoComponent } from '../demo.component';

@Component({
  selector: 'sky-demo-fixture',
  templateUrl: './demo.component.fixture.html',
})
export class DemoFixtureComponent {
  public alignContents: SkyDocsDemoContentAlignment;

  public backgroundColors: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: '#f00', label: 'Red' },
    { value: '#0f0', label: 'Green' },
    { value: '#00f', label: 'Blue' },
  ];

  public users: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: { name: 'John' }, label: 'John' },
    { value: { name: 'Jane' }, label: 'Jane' },
  ];

  public demoSettings: {
    backgroundColor?: string;
    showIcon?: boolean;
  } = {};

  public heading: string;

  public showRadios: boolean = true;

  @ViewChild(SkyDocsDemoComponent)
  public demoComponentRef: SkyDocsDemoComponent;

  @ViewChild(SkyDocsDemoControlPanelComponent)
  public demoControlPanelComponentRef: SkyDocsDemoControlPanelComponent;

  public onDemoReset(): void {}

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {}

  public changeFormControls(): void {
    this.showRadios = false;
  }
}
