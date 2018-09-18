import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyIconComponent {
  @Input()
  public icon: string;

  @Input()
  public size: string;

  @Input()
  public fixedWidth: boolean;

  public classList(): string[] {
    let list: string[] = [];
    list.push('fa-' + this.icon);
    if (this.size) {
      list.push('fa-' + this.size);
    }
    if (this.fixedWidth) {
      list.push('fa-fw');
    }
    return list;
  }
}
