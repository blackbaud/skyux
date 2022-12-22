import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sky-href-demo',
  templateUrl: './sky-href-demo.component.html',
  styleUrls: ['./sky-href-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyHrefDemoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
