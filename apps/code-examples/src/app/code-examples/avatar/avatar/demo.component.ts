import { Component } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyFileItem } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyAvatarModule],
})
export class DemoComponent {
  protected avatarUrl: string | File = 'https://imgur.com/tBiGElW.png';

  protected name = 'Robert C. Hernandez';

  protected updateSrc(fileItem: SkyFileItem): void {
    /**
     * This is where you might upload the new avatar,
     * but for this demo we'll just update it locally.
     */
    if (fileItem) {
      this.avatarUrl = fileItem.file;
    }
  }
}
