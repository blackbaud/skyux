import { Component } from '@angular/core';
import { SkyLinkListModule } from '@skyux/pages';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [SkyLinkListModule],
  templateUrl: './links.component.html',
})
export class LinksComponent {}
