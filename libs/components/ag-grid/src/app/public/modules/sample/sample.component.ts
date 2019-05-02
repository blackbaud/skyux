import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  MyLibraryService
} from './sample.service';

@Component({
  selector: 'my-lib-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyLibrarySampleComponent implements OnInit {
  public appSettings: any;

  constructor(
    private appConfig: SkyAppConfig,
    private myLibrary: MyLibraryService
  ) { }

  public ngOnInit(): void {
    this.appSettings = this.appConfig.skyux.appSettings;
    this.myLibrary.sayGoodbye();
  }
}
