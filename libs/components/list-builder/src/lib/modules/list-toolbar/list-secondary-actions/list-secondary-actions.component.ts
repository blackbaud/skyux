import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ListStateDispatcher } from '../../list/state/list-state.rxstate';
import { ListToolbarItemModel } from '../../list/state/toolbar/toolbar-item.model';

import { SkyListSecondaryActionsService } from './list-secondary-actions.service';

/**
 * Adds a dropdown to the list toolbar for secondary actions. If the dropdown does not
 * include actions, the secondary actions dropdown is hidden.
 * @deprecated
 */
@Component({
  selector: 'sky-list-secondary-actions',
  templateUrl: './list-secondary-actions.component.html',
  providers: [SkyListSecondaryActionsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyListSecondaryActionsComponent implements AfterViewInit {
  public actions: any[] = [];

  @ViewChild('secondaryActions', {
    read: TemplateRef,
    static: true,
  })
  private secondaryActionsTemplate: TemplateRef<unknown>;

  private secondaryActionsItemToolbarIndex = 5000;

  constructor(private dispatcher: ListStateDispatcher) {}

  public ngAfterViewInit(): void {
    const secondaryActionItem = new ListToolbarItemModel({
      id: 'secondary-actions',
      template: this.secondaryActionsTemplate,
      location: 'center',
      index: this.secondaryActionsItemToolbarIndex,
    });

    this.dispatcher.toolbarAddItems([secondaryActionItem]);
  }
}
