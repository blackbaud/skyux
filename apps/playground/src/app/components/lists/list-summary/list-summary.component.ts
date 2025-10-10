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
    { value: 2, label: 'Summary 3', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 4', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 5', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 6', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 7', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 8', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 9', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 10', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 11', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 12', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 13', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 14', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 15', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 16', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 17', valueFormat: { format: 'currency' } },
    { value: 2, label: 'Summary 18', valueFormat: { format: 'currency' } },
  ];
}
