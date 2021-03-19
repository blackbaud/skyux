import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box.component.fixture.html'
})
export class SelectionBoxTestComponent {

  public checkboxArray: any = [
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Write an introduction',
      description: 'A brief one paragraph introduction about your organzation will help supporters identify with your cause'
    },
    {
      icon: 'calendar',
      iconType: 'skyux',
      header: 'Schedule a consultation',
      description: 'Get something on the calendar to engage your constituents!'
    },
    {
      icon: 'clock',
      iconType: 'skyux',
      header: 'Save time and effort',
      description: 'Encourage supporters to interact with your organization'
    }
  ];

  public radioArray: any = [
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Red',
      name: 'red'
    },
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Yellow',
      name: 'yellow'
    },
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Blue',
      name: 'blue'
    }
  ];
}
