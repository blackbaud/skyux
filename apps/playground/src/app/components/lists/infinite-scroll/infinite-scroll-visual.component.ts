import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

@Component({
  selector: 'app-infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html',
  standalone: false,
})
export class InfiniteScrollVisualComponent {
  public disableLoader = false;

  public enabled = true;

  public items = [0, 1, 2, 3];

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

@NgModule({
  imports: [CommonModule, SkyInfiniteScrollModule, SkyRepeaterModule],
  declarations: [InfiniteScrollVisualComponent],
  exports: [InfiniteScrollVisualComponent],
})
export class InfiniteScrollVisualComponentModule {}
