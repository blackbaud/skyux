import { Component } from '@angular/core';
import { SkyDocsHeadingAnchorModule } from '@skyux/docs-tools';

@Component({
  imports: [SkyDocsHeadingAnchorModule],
  selector: 'app-heading-anchor',
  templateUrl: './heading-anchor.component.html',
  styleUrls: ['./heading-anchor.component.scss'],
})
export class HeadingAnchorComponent {}
