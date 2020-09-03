import {
  Component
} from '@angular/core';

import {
  SkyFileItem
} from '@skyux/forms';

@Component({
  selector: 'app-avatar-demo',
  templateUrl: './avatar-demo.component.html'
})
export class AvatarDemoComponent {

  public avatarUrl: string | File = 'https://imgur.com/tBiGElW.png';

  public name = 'Robert C. Hernandez';

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
