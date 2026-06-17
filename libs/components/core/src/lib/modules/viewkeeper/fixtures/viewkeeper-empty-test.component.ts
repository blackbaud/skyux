import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-viewkeeper-empty-test',
  templateUrl: './viewkeeper-empty-test.component.html',
  styleUrls: ['./viewkeeper-empty-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewkeeperEmptyTestComponent {}
