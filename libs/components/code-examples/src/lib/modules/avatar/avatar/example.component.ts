import { Component, inject, signal } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyFileItem } from '@skyux/forms';

import { DemoService } from './example.service';

/**
 * @title Basic example
 */
@Component({
  selector: 'app-avatar-example',
  templateUrl: './example.component.html',
  imports: [SkyAvatarModule],
})
export class AvatarExampleComponent {
  #exampleSvc = inject(DemoService);

  protected readonly avatar = signal<string | File>(
    'https://imgur.com/tBiGElW.png',
  );
  protected readonly name = signal('Robert C. Hernandez');

  protected onAvatarChanged(fileItem: SkyFileItem): void {
    /**
     * This is where you might upload the new avatar,
     * but for this example we'll just update it locally.
     */
    if (fileItem) {
      this.#exampleSvc.uploadAvatar(fileItem.file).subscribe(() => {
        this.avatar.set(fileItem.file);
      });
    }
  }
}
