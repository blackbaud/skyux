import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyGridComponent
} from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-async.component.fixture.html'
})
export class GridAsyncTestComponent implements OnInit {

  public asyncHeading = new BehaviorSubject<string>('');

  public asyncDescription = new BehaviorSubject<string>('');

  public asyncPopover: any;

  public items: Array<any> = [
    { 'id': 1, 'name': 'Windstorm', 'email': 'windstorm@gmail.com' },
    { 'id': 2, 'name': 'Bombasto', 'email': 'bombasto@gmail.com' },
    { 'id': 3, 'name': 'Magneta', 'email': 'magenta@gmail.com' },
    { 'id': 4, 'name': 'Tornado', 'email': 'tornado@gmail.com' }
  ];

  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

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
