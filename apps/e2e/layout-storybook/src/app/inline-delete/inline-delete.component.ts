import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-inline-delete',
  templateUrl: './inline-delete.component.html',
  styleUrls: ['./inline-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InlineDeleteComponent {}
