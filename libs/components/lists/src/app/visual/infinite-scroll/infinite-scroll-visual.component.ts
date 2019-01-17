import {
  Component
} from '@angular/core';

@Component({
  selector: 'infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html'
})
export class InfiniteScrollVisualComponent {
  public firstList: any[] = [
    0, 1
  ];
  public secondList: any[] = [
    0, 1
  ];

  public secondEnabled = true;

  public addToSecond() {
    setTimeout(() => {
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
    }, 1000);
  }
}
