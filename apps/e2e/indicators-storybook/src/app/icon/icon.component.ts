import { Component } from '@angular/core';
import { getIconManifest } from '@skyux/icons';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  protected readonly icons = getIconManifest()
    .glyphs.filter((glyph) => !glyph.deprecated)
    .sort((a, b) => a.name.localeCompare(b.name));
}
