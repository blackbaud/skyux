import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyLinkListModule } from '@skyux/pages';

@Component({
  selector: 'app-links',
  imports: [SkyLinkListModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './links.component.html',
})
export class LinksComponent {}
