import {
  Component,
  OnInit
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-async.component.fixture.html'
})
export class GridAsyncTestComponent implements OnInit {
  public items: Array<any> = [
    { 'id': 1, 'name': 'Windstorm', 'email': 'windstorm@gmail.com' },
    { 'id': 2, 'name': 'Bombasto', 'email': 'bombasto@gmail.com' },
    { 'id': 3, 'name': 'Magneta', 'email': 'magenta@gmail.com' },
    { 'id': 4, 'name': 'Tornado', 'email': 'tornado@gmail.com' }
  ];

  public asyncHeading = new BehaviorSubject<string>('');

  public ngOnInit() {
    setTimeout(() => {
      this.asyncHeading.next('Column1');
    }, 100);
  }
}
