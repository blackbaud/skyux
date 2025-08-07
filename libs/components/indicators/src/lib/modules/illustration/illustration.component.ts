import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { catchError, from, of, switchMap } from 'rxjs';

import { SkyIllustrationResolverService } from './illustration-resolver.service';
import { SkyIllustrationSize } from './illustration-size';

/**
 * Displays a spot illustration at the specified size.
 */
@Component({
  selector: 'sky-illustration',
  imports: [CommonModule],
  templateUrl: './illustration.component.html',
  styleUrls: [
    './illustration.default.component.scss',
    './illustration.modern.component.scss',
  ],
  hostDirectives: [SkyThemeComponentClassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyIllustrationComponent {
  readonly #resolverSvc = inject(SkyIllustrationResolverService, {
    optional: true,
  });

  /**
   * The name of the illustration to display.
   * @required
   */
  public readonly name = input.required<string>();

  /**
   * The size of the illustration.
   * @required
   */
  public readonly size = input.required<SkyIllustrationSize>();

  protected readonly url = toSignal(
    toObservable(this.name).pipe(
      switchMap((name) =>
        this.#resolverSvc ? from(this.#resolverSvc.resolveUrl(name)) : of(''),
      ),
      catchError(() => of('')),
    ),
  );
}
