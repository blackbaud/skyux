import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SkyAppViewportReservedPositionType,
  SkyAppViewportService,
} from '@skyux/theme';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  standalone: false,
})
export class PageComponent implements OnInit, OnDestroy {
  public spaces: Record<SkyAppViewportReservedPositionType, number> = {
    left: 10,
    top: 40,
    right: 80,
    bottom: 120,
  };

  #viewportSvc: SkyAppViewportService;

  constructor(viewportSvc: SkyAppViewportService) {
    this.#viewportSvc = viewportSvc;
  }

  public ngOnInit(): void {
    for (const [position, size] of Object.entries(this.spaces)) {
      this.#viewportSvc.reserveSpace({
        id: position,
        position: position as SkyAppViewportReservedPositionType,
        size,
      });
    }
  }

  public ngOnDestroy(): void {
    for (const position of Object.keys(this.spaces)) {
      this.#viewportSvc.unreserveSpace(position);
    }
  }
}
