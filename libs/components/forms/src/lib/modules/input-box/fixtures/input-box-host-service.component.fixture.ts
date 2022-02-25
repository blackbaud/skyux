import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { SkyInputBoxHostService } from '../input-box-host.service';

@Component({
  selector: 'app-input-box-host-service-fixture',
  templateUrl: './input-box-host-service.component.fixture.html',
})
export class InputBoxHostServiceFixtureComponent implements OnInit {
  @ViewChild('inputTemplate', {
    read: TemplateRef,
    static: true,
  })
  private inputTemplate: TemplateRef<any>;

  @ViewChild('buttonsTemplate', {
    read: TemplateRef,
    static: true,
  })
  private buttonsTemplate: TemplateRef<any>;

  constructor(private inputBoxHostSvc: SkyInputBoxHostService) {}

  public ngOnInit(): void {
    this.inputBoxHostSvc.populate({
      inputTemplate: this.inputTemplate,
      buttonsTemplate: this.buttonsTemplate,
    });
  }
}
