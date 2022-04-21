import {
  Component,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SkyInputBoxHostService } from '@skyux/forms';

@Component({
  selector: 'app-input-box-visual-host',
  templateUrl: './input-box-visual-host.component.html',
})
export class InputBoxVisualHostComponent implements OnInit {
  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  private inputTemplateRef: TemplateRef<any>;

  constructor(@Optional() public inputBoxHostSvc?: SkyInputBoxHostService) {}

  public ngOnInit(): void {
    if (this.inputBoxHostSvc) {
      this.inputBoxHostSvc.populate({
        inputTemplate: this.inputTemplateRef,
      });
    }
  }
}
