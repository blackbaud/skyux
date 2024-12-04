import { Component, OnInit, inject, signal } from '@angular/core';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

import { firstValueFrom } from 'rxjs';

import { DemoService } from './demo.service';
import { InfiniteScrollDemoItem } from './item';

let pageNumber = 0;

@Component({
  standalone: true,
  selector: 'app-demo',
  styleUrl: './demo.component.scss',
  templateUrl: './demo.component.html',
  imports: [SkyInfiniteScrollModule, SkyRepeaterModule],
})
export class DemoComponent implements OnInit {
  #demoSvc = inject(DemoService);

  protected hasMoreItems = signal<boolean>(false);
  protected items = signal<InfiniteScrollDemoItem[]>([]);

  public ngOnInit(): void {
    void this.#addData();
  }

  protected onScrollEnd(): void {
    console.log('onScrollEnd()');
    if (this.hasMoreItems()) {
      void this.#addData();
    }
  }

  async #addData(): Promise<void> {
    const result = await firstValueFrom(this.#demoSvc.getItems(pageNumber++));
    const data = this.items().concat(result.data);

    this.items.set(data);
    this.hasMoreItems.set(result.hasMore);
  }
}
