import {
  Component
} from '@angular/core';

@Component({
  selector: 'infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html'
})
export class InfiniteScrollVisualComponent {

  public disableLoader: boolean = false;

  public enabled: boolean = true;

  public items: any[] = [
    0, 1, 2, 3
  ];

  public showScrollableContainer: boolean = false;

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
