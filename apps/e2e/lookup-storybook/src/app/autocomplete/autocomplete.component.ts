import { AfterViewInit, Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements AfterViewInit {
  public data: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  protected ready = new BehaviorSubject<boolean>(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready.next(true);
    }, 200);
  }
}
