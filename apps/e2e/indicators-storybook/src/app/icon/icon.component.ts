import { Component } from '@angular/core';
import { SkyIconManifestGlyph, getIconManifest } from '@skyux/icons';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: false,
})
export class IconComponent {
  protected readonly icons: SkyIconManifestGlyph[];
  protected readonly faIcons: string[] = [];

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
}
