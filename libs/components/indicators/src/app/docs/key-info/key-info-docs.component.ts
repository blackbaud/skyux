import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-key-info-docs',
  templateUrl: './key-info-docs.component.html'
})
export class KeyInfoDocsComponent {

  public layout: string = 'vertical';

  public layoutChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' }
  ];

  public onDemoSelectionChange(event: SkyDocsDemoControlPanelChange): void {
    if (event.layout) {
      this.layout = event.layout;
    }
  }

}
