import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyNumericService
} from '../../public';

@Component({
  selector: 'sky-numeric-demo',
  templateUrl: './numeric-demo.component.html',
  styleUrls: ['./numeric-demo.component.scss']
})
export class SkyNumericDemoComponent implements OnInit {
  constructor(
    private numericService: SkyNumericService
  ) { }

  public ngOnInit(): void {
    const quantity = 40.50;
    const formatted = this.numericService.formatNumber(quantity, {
      digits: 2,
      format: 'currency',
      iso: 'USD'
    });

    console.log(`The number, ${quantity}, is formatted as ${formatted}.`);
  }
}
