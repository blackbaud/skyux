import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyGridLegacyComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-async.component.fixture.html',
  standalone: false,
})
export class GridAsyncTestComponent implements OnInit {
  public asyncHeading = new BehaviorSubject<string>('');

  public asyncDescription = new BehaviorSubject<string>('');

  public asyncPopover: any;

  public items: any[] = [
    { id: 1, name: 'Windstorm', email: 'windstorm@gmail.com' },
    { id: 2, name: 'Bombastic', email: 'Bombastic@gmail.com' },
    { id: 3, name: 'Magenta', email: 'magenta@gmail.com' },
    { id: 4, name: 'Tornado', email: 'tornado@gmail.com' },
  ];

  @ViewChild(SkyGridLegacyComponent)
  public grid: SkyGridLegacyComponent;

  @ViewChild('asyncPopoverRef')
  private popoverTemplate: any;

  public ngOnInit(): void {
    setTimeout(() => {
      this.asyncHeading.next('Column1');
      this.asyncDescription.next('Column1 Description');
      this.asyncPopover = this.popoverTemplate;
    }, 100);
  }
}
