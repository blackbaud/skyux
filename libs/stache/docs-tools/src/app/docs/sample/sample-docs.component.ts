import {
  Component
} from '@angular/core';

import { SkyDocsBehaviorDemoControlPanelConfig } from '../../public';

@Component({
  selector: 'app-sample-docs',
  templateUrl: './sample-docs.component.html'
})
export class AppSampleDocsComponent {
  public behaviorDemoConfig: SkyDocsBehaviorDemoControlPanelConfig = {
    columns: [
      {
        radioGroup: {
          name: 'test-value',
          value: 'bar',
          radios: [
            { value: 'foo', label: 'Foo' },
            { value: 'bar', label: 'Bar' },
            { value: 'baz', label: 'Baz' }
          ]
        },
        checkboxes: [
          { label: 'Check this please', checked: true, value: 'showThing' }
        ]
      },
      {
        radioGroup: {
          name: 'another-value',
          value: 'bar',
          radios: [
            { value: 'foo', label: 'Foo' },
            { value: 'bar', label: 'Bar' },
            { value: 'baz', label: 'Baz' }
          ]
        },
        checkboxes: [
          { label: 'Foo', checked: true, value: 'foo' },
          { label: 'Bar', checked: false, value: 'bar' },
          { label: 'Baz', checked: true, value: 'baz' }
        ]
      }
    ]
  };

  public onBehaviorDemoSelection(change: any): void {
    console.log('change:', change);
  }
}
