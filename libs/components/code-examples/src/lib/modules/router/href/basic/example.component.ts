import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyHrefModule } from '@skyux/router';

@Component({
  selector: 'app-router-href-basic-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyHrefModule],
})
export class RouterHrefBasicExampleComponent {}
