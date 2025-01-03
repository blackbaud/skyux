import { Component, inject, signal } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyFileItem } from '@skyux/forms';

import { DemoService } from './demo.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyAvatarModule],
})
export class DemoComponent {
  #demoSvc = inject(DemoService);

  protected readonly avatar = signal<string | File>(
    'https://imgur.com/tBiGElW.png',
  );
  protected readonly name = signal('Robert C. Hernandez');

  protected onAvatarChanged(fileItem: SkyFileItem): void {
    /**
     * This is where you might upload the new avatar,
     * but for this demo we'll just update it locally.
     */
    if (fileItem) {
      this.#demoSvc.uploadAvatar(fileItem.file).subscribe(() => {
        this.avatar.set(fileItem.file);
      });
    }
  }
}
