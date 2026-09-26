import {
  Component,
  DOCUMENT,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import {
  SkyIconModule,
  SkyIconSize,
  SkyIconSvgResolverService,
  SkyIconVariantType,
} from '@skyux/icon';
import { IconPreviewService } from '@skyux/storybook/icon-preview';

import { getIconNames } from '../icon-names';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  imports: [SkyIconModule],
})
export class IconsComponent {
  readonly #doc = inject(DOCUMENT);
  readonly #iconPreview = inject(IconPreviewService);
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #starIcon = resource({
    params: () => signal('star'),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  protected readonly iconMap = computed(() => {
    const iconsReady = this.#starIcon.hasValue();
    const iconsPreviewReady = this.#iconPreview.ready();
    if (iconsReady && iconsPreviewReady) {
      return getIconNames(this.#doc);
    }
    return undefined;
  });

  public readonly size = input<SkyIconSize>('m');
  public readonly variant = input<SkyIconVariantType>('line');
}

export default IconsComponent;
