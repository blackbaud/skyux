import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'format-visual',
  templateUrl: './format-visual.component.html'
})
export class FormatVisualComponent implements OnInit {

  public text: string;

  public ngOnInit() {
    this.text = '{0} hello {0} {1}';
  }

}
