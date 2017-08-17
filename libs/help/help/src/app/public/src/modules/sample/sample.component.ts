import { Component } from '@angular/core';

import { BBHelpConfigService } from '../shared';

@Component({
  selector: 'lib-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class LibrarySampleComponent {
  constructor(public configService: BBHelpConfigService) {}
}
