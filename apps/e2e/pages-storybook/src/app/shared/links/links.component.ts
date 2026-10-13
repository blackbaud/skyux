import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyLinkListModule } from '@skyux/pages';

@Component({
  selector: 'app-links',
  imports: [SkyButton, SkyLinkListModule],
  templateUrl: './links.component.html',
})
export class LinksComponent {}
