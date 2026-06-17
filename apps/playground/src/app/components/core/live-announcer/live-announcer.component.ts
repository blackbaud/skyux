import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  selector: 'app-live-announcer',
  templateUrl: './live-announcer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, SkyInputBoxModule],
})
export default class LiveAnnouncerComponent {
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  protected announcementMessage = '';

  protected announce(): void {
    this.#liveAnnouncerSvc.announce(this.announcementMessage);
  }
}
