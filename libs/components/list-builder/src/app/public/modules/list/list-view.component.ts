import { ListState } from './state';
import { SkyListComponent } from '../list/list.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

let idIndex = 0;

export abstract class ListViewComponent {
  public active: Observable<boolean>;

  protected viewName: string;
  protected state: ListState;
  protected list: SkyListComponent;
  protected hasToolbar: Observable<boolean>;

  private viewId: string = `sky-list-view-cmp-${++idIndex}`;

  constructor(state: ListState, defaultName: string) {
    this.state = state;
    this.viewName = defaultName;

    this.hasToolbar = this.state.map(s => s.toolbar.exists);

    this.active = this.state.map(s => s.views.active === this.viewId);

    this.active.distinctUntilChanged().subscribe(
      isActive => isActive ? this.onViewActive() : this.onViewInactive()
    );
  }

  get id() {
    return this.viewId;
  }

  get label() {
    return this.viewName;
  }

  /* istanbul ignore next */
  public onViewActive() {
  }

  public onViewInactive() {
  }
}
