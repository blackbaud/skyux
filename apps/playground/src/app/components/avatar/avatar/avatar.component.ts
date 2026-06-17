import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-avatar',
  styleUrls: ['./avatar.component.scss'],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AvatarComponent {
  public name = 'Robert C. Hernandez';
}
