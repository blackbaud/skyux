import { Observable } from 'rxjs';
import { distinctUntilChanged, map as observableMap } from 'rxjs/operators';

import { SkyListComponent } from '../list/list.component';

import { ListState } from './state/list-state.state-node';

let idIndex = 0;

/**
 * @internal
 */
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

    /* istanbul ignore next */
    this.hasToolbar = this.state.pipe(observableMap((s) => s.toolbar.exists));

    this.active = this.state.pipe(
      observableMap((s) => s.views.active === this.viewId)
    );

    this.active
      .pipe(distinctUntilChanged())
      .subscribe((isActive) =>
        isActive ? this.onViewActive() : this.onViewInactive()
      );
  }

  get id() {
    return this.viewId;
  }

  get label() {
    return this.viewName;
  }

  /* istanbul ignore next */
  public onViewActive() {}

  public onViewInactive() {}
}
