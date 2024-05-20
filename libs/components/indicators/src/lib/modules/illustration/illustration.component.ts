import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { catchError, from, of, switchMap } from 'rxjs';

import { SkyIllustrationResolverService } from './illustration-resolver.service';
import { SkyIllustrationSize } from './illustration-size';

const pixelSizes: Record<SkyIllustrationSize, number> = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 96,
};

/**
 * Displays a spot illustration at the specified size.
 */
@Component({
  selector: 'sky-illustration',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './illustration.component.html',
  styleUrls: ['./illustration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyIllustrationComponent {
  readonly #resolverSvc = inject(SkyIllustrationResolverService, {
    optional: true,
  });

  /**
   * The name of the illustration to display.
   */
  public readonly name = input.required<string>();

  /**
   * The size of the illustration.
   */
  public readonly size = input.required<SkyIllustrationSize>();

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHidden = true;

  protected readonly url = toSignal(
    toObservable(this.name).pipe(
      switchMap((name) =>
        this.#resolverSvc ? from(this.#resolverSvc.resolveUrl(name)) : of(''),
      ),
      catchError(() => of('')),
    ),
  );

  protected readonly pixelSize = computed(() => pixelSizes[this.size()]);
}
