import { Component } from '@angular/core';
import { SkyDocsShowcaseModule } from '@skyux/docs-tools';

@Component({
  imports: [SkyDocsShowcaseModule],
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss'],
})
export class ShowcaseComponent {}
