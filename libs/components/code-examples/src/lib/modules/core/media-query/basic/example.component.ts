import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  imports: [CommonModule, SkyIconModule],
  selector: 'app-core-media-query-basic-example',
  templateUrl: './example.component.html',
})
export class CoreMediaQueryBasicExampleComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
