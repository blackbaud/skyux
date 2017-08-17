import { Component } from '@angular/core';

import { LibraryConfigService } from '../shared';

@Component({
  selector: 'lib-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class LibrarySampleComponent {
  constructor(public configService: LibraryConfigService) {}
}
