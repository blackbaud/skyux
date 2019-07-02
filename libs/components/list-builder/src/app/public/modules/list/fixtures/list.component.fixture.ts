import { Component, ViewChild, Inject } from '@angular/core';
import { SkyListComponent } from '../list.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyListToolbarComponent } from '../../list-toolbar';
import { ListViewComponent } from '../list-view.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list.component.fixture.html'
})
export class ListTestComponent {
  @ViewChild(SkyListComponent)
  public list: SkyListComponent;

  @ViewChild('toolbar')
  public toolbar: SkyListToolbarComponent;

  public default: ListViewComponent;
  public sortFields: any;

  constructor(@Inject('items') public items: any) {
  }

  public get options() {
    let bs = new BehaviorSubject<Array<any>>(['banana', 'apple']);
    return bs.asObservable();
  }

}
