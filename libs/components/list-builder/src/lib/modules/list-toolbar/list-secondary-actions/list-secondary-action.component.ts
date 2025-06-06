import {
  AfterContentInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { SkyListSecondaryActionsService } from './list-secondary-actions.service';

/**
 * Adds actions to the secondary actions dropdown in the list toolbar.
 * @deprecated
 */
@Component({
  selector: 'sky-list-secondary-action',
  templateUrl: './list-secondary-action.component.html',
  standalone: false,
})
export class SkyListSecondaryActionComponent implements AfterContentInit {
  @ViewChild('listSecondaryAction', {
    read: TemplateRef,
    static: true,
  })
  private templateRef: TemplateRef<unknown>;

  constructor(private actionService: SkyListSecondaryActionsService) {}

  public ngAfterContentInit(): void {
    this.actionService.addSecondaryAction({
      template: this.templateRef,
    });
  }
}
