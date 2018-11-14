import {
  Component
} from '@angular/core';

import {
  SkyFlyoutService
} from '../../public';

import {
  FlyoutDemoComponent
} from './flyout-demo.component';

import {
  FlyoutDemoContext
} from './flyout-demo-context';

@Component({
  selector: 'flyout-visual',
  templateUrl: './flyout-visual.component.html',
  styleUrls: ['./flyout-visual.component.scss']
})
export class FlyoutVisualComponent {
  public users: {id: string, name: string}[] = [
    { id: '1', name: 'Sally' },
    { id: '2', name: 'John' },
    { id: '3', name: 'David' },
    { id: '4', name: 'Janet' }
  ];

  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public openFlyout(record: any) {
    this.flyoutService.open(FlyoutDemoComponent, {
      providers: [{
        provide: FlyoutDemoContext,
        useValue: record
      }]
    });
  }
}
