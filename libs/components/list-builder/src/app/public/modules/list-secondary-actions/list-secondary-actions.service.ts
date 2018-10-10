import {
  Injectable,
  OnDestroy
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SkyListSecondaryAction } from './list-secondary-action';

@Injectable()
export class SkyListSecondaryActionsService implements OnDestroy {
  public secondaryActionsCount = 0;
  public secondaryActionsSubject = new BehaviorSubject<number>(0);
  public actionsStream = new BehaviorSubject<SkyListSecondaryAction[]>([]);
  private actions: SkyListSecondaryAction[] = [];

  public addSecondaryAction(action: SkyListSecondaryAction) {
    this.secondaryActionsCount++;
    this.secondaryActionsSubject.next(this.secondaryActionsCount);
    this.actions.push(action);
    this.actionsStream.next(this.actions);
  }

  public removeSecondaryAction(action: any) {
    this.secondaryActionsCount--;
    this.secondaryActionsSubject.next(this.secondaryActionsCount);
    this.actions = this.actions.filter(existingItem => existingItem !== action);
    this.actionsStream.next(this.actions);
  }

  public ngOnDestroy() {
    this.secondaryActionsSubject.complete();
    this.actionsStream.complete();
  }
}
