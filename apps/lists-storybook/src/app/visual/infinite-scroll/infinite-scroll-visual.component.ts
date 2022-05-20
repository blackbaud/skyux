import { Component } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html',
})
export class InfiniteScrollVisualComponent {
  public disableLoader = false;

  public enabled = true;

  public items: any[] = [0, 1, 2, 3];

  public showScrollableContainer = false;

  public loadMore(): void {
    if (!this.disableLoader) {
      setTimeout(() => {
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
        this.items.push(this.items.length);
      }, 1000);
    }
  }

  public toggleScrollableContainer(): void {
    this.showScrollableContainer = !this.showScrollableContainer;
  }
}
