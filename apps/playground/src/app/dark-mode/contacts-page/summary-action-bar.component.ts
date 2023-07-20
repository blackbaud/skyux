import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, SkyKeyInfoModule, SkySummaryActionBarModule],
})
export class SummaryActionBarComponent {
  @Input()
  public contacts: string[];

  public onEmailClick(): void {
    alert('Email button clicked.');
  }

  public onSecondaryActionClick(): void {
    alert('Assign prospect button clicked.');
  }

  public onSecondaryAction2Click(): void {
    alert('Remove from list button clicked.');
  }
}
