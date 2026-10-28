import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  imports: [SkyIconModule],
  selector: 'app-icon-containers',
  templateUrl: './icon-containers.component.html',
  styleUrls: ['./icon-containers.component.scss'],
})
export class IconContainersComponent {
  protected readonly containers = [
    'default',
    'dimmed',
    'backdrop',
    'prominent',
    'header-prominent',
    'danger',
    'info',
    'success',
    'warning',
  ];

  protected readonly icons = ['info', 'success', 'warning', 'edit', 'search'];

  protected readonly variants = ['line', 'solid'] as const;
}

export default IconContainersComponent;
