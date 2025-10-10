import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyListSummaryModule } from '@skyux/lists';

@Component({
  standalone: true,
  imports: [CommonModule, SkyListSummaryModule],
  selector: 'app-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss'],
})
export class ListSummaryComponent {
  protected summaryItems = [
    { value: 1, label: 'Summary 1', helpPopoverContent: 'test' },
    { value: 2, label: 'Summary 2', valueFormat: { format: 'currency' } },
  ];
}
