import {
  ChangeDetectorRef,
  Component,
  Injectable,
  inject,
} from '@angular/core';
import { SKY_HELP_GLOBAL_OPTIONS, SkyHelpService } from '@skyux/core';

import { Observable, of } from 'rxjs';

@Injectable()
class DemoHelpService extends SkyHelpService {
  public override get widgetReadyStateChange(): Observable<boolean> {
    return of(true);
  }

  public override openHelp(): void {
    alert('Help opened!');
  }

  public override updateHelp(): void {
    alert('Help');
  }
}

@Component({
  selector: 'app-help-inline',
  templateUrl: './help-inline.component.html',
  providers: [
    {
      provide: SKY_HELP_GLOBAL_OPTIONS,
      useValue: {
        ariaControls: 'foo-id',
        ariaHaspopup: 'modal',
      },
    },
    {
      provide: SkyHelpService,
      useClass: DemoHelpService,
    },
  ],
  standalone: false,
})
export class HelpInlineComponent {
  public popoverOpen = false;

  readonly #changeDetector = inject(ChangeDetectorRef);

  public popoverChange(isOpen: boolean): void {
    this.popoverOpen = isOpen;
    this.#changeDetector.markForCheck();
  }
}
