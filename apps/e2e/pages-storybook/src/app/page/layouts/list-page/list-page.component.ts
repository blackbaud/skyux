import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [CommonModule, SkyPageModule],
  templateUrl: './list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListPageComponent {}
