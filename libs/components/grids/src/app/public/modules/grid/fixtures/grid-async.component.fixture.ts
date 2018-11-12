import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyGridComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-async.component.fixture.html'
})
export class GridAsyncTestComponent implements OnInit {

  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

  public items: Array<any> = [
    { 'id': 1, 'name': 'Windstorm', 'email': 'windstorm@gmail.com' },
    { 'id': 2, 'name': 'Bombasto', 'email': 'bombasto@gmail.com' },
    { 'id': 3, 'name': 'Magneta', 'email': 'magenta@gmail.com' },
    { 'id': 4, 'name': 'Tornado', 'email': 'tornado@gmail.com' }
  ];

  public asyncHeading = new BehaviorSubject<string>('');
  public asyncDescription = new BehaviorSubject<string>('');

  public ngOnInit() {
    setTimeout(() => {
      this.asyncHeading.next('Column1');
      this.asyncDescription.next('Column1 Description');
    }, 100);
  }
}
