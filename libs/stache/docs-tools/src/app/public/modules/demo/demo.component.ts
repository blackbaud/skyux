import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoComponent {

  public get toggleOptionsButtonIcon(): string {
    return (this.areOptionsVisible) ? 'chevron-up' : 'chevron-down';
  }

  public areOptionsVisible = false;

  public onToggleOptionsButtonClick(): void {
    this.areOptionsVisible = !this.areOptionsVisible;
  }

}
