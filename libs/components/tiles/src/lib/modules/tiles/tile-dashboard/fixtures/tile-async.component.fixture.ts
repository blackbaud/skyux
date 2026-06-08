import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'div.sky-test-tile-async',
  template: `
    @if (show()) {
      <sky-tile tileName="AsyncTile">
        <sky-tile-title>AsyncTile</sky-tile-title>
        <sky-tile-content>Content</sky-tile-content>
      </sky-tile>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TileAsyncTestComponent {
  public show = signal(false);
}
