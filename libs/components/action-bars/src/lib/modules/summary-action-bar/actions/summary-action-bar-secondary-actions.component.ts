import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  contentChildren,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import type { SkyDropdownMessage } from '@skyux/popovers';
import { SkyDropdownMessageType, SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { Subject } from 'rxjs';

import { SkyActionBarsResourcesModule } from '../../shared/sky-action-bars-resources.module';

import { SkySummaryActionBarSecondaryActionComponent } from './summary-action-bar-secondary-action.component';

/**
 * Contains secondary actions specified with `sky-summary-action-bar-secondary-action`
 * components.
 */
@Component({
  imports: [
    CommonModule,
    SkyActionBarsResourcesModule,
    SkyDropdownModule,
    SkyIconModule,
  ],
  selector: 'sky-summary-action-bar-secondary-actions',
  templateUrl: './summary-action-bar-secondary-actions.component.html',
  styleUrls: ['./summary-action-bar-secondary-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkySummaryActionBarSecondaryActionsComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #mediaQuerySvc = inject(SkyMediaQueryService);

  protected readonly breakpoint = toSignal(
    this.#mediaQuerySvc.breakpointChange,
  );

  public dropdownMessageStream = new Subject<SkyDropdownMessage>();

  public readonly secondaryActionComponents =
    contentChildren<SkySummaryActionBarSecondaryActionComponent>(
      SkySummaryActionBarSecondaryActionComponent,
    );

  constructor() {
    effect(() => {
      const actions = this.secondaryActionComponents();
      const breakpoint = this.breakpoint();

      for (const action of actions) {
        action.isDropdown = breakpoint === 'xs' || actions.length >= 5;

        action.actionClick
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => {
            this.dropdownMessageStream.next({
              type: SkyDropdownMessageType.Close,
            });
          });
      }
    });
  }
}
