import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { SkyInputBoxHostService } from '../input-box-host.service';

@Component({
  selector: 'sky-input-box-host-service-fixture',
  templateUrl: './input-box-host-service.component.fixture.html',
})
export class InputBoxHostServiceFixtureComponent implements OnInit {
  @ViewChild('inputTemplate', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplate: TemplateRef<unknown> | undefined;

  @ViewChild('buttonsTemplate', {
    read: TemplateRef,
    static: true,
  })
  public buttonsTemplate: TemplateRef<unknown> | undefined;

  #inputBoxHostSvc: SkyInputBoxHostService;

  constructor(inputBoxHostSvc: SkyInputBoxHostService) {
    this.#inputBoxHostSvc = inputBoxHostSvc;
  }

  public ngOnInit(): void {
    this.#inputBoxHostSvc.populate({
      inputTemplate: this.inputTemplate!,
      buttonsTemplate: this.buttonsTemplate,
    });
  }
}
