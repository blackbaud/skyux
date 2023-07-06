import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-open',
  template: `
    <button class="sky-btn sky-btn-default" (click)="open()">Open modal</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalOpenerComponent {
  constructor(private readonly modalSvc: SkyModalService) {}

  public open(): void {
    this.modalSvc.open(ModalComponent, {});
  }
}
