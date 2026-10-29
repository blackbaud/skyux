import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

@Component({
  imports: [SkyButton, SkyIconModule],
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss'],
})
export class ContainersComponent {
  protected readonly containers = [
    'default',
    'dimmed',
    'backdrop',
    'prominent',
    'danger',
    'info',
    'success',
    'warning',
  ];

  protected readonly icons = ['info', 'success', 'warning', 'edit'];
}
