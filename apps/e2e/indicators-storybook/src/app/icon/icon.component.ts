import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { SkyIconManifestGlyph, getIconManifest } from '@skyux/icons';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: false,
})
export class IconComponent implements AfterViewInit, OnDestroy {
  protected readonly icons: SkyIconManifestGlyph[];
  protected readonly faIcons: string[] = [];
  protected readonly ready = new BehaviorSubject(false);

  #fontLoadingService = inject(FontLoadingService);
  #subscriptions = new Subscription();

  constructor() {
    this.icons = getIconManifest()
      .glyphs.map((glyph) => {
        glyph.faNames?.forEach((name) => {
          if (!this.faIcons.includes(name)) {
            this.faIcons.push(name);
          }
        });

        return glyph;
      })
      .filter((glyph) => !glyph.deprecated)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.faIcons.sort((a, b) => a.localeCompare(b));
  }

  public ngAfterViewInit(): void {
    this.#subscriptions.add(
      this.#fontLoadingService.ready().subscribe(() => {
        this.ready.next(true);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
