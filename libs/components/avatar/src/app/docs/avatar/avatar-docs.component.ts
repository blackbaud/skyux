import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

import {
  SkyFileItem
} from '@skyux/forms';

@Component({
  selector: 'app-avatar-docs',
  templateUrl: './avatar-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarDocsComponent {

  public avatarUrl: string | File = 'https://imgur.com/tBiGElW.png';

  public name: string = 'Robert C. Hernandez';

  public showImage: boolean = true;

  public get src(): string | File {
    return this.showImage ?  this.avatarUrl : undefined;
  }

  public onDemoSelectionChange(event: SkyDocsDemoControlPanelChange): void {
    if (event.showImage !== undefined) {
      this.showImage = event.showImage;
    }
  }

  public updateSrc(fileItem: SkyFileItem): void {
    /*
      This is where you might upload the new avatar,
      but for this demo we'll just update it locally.
    */
    if (fileItem) {
      this.avatarUrl = fileItem.file;
    }
  }

}
