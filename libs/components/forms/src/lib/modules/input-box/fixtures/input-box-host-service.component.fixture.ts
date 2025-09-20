import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { SkyInputBoxHostService } from '../input-box-host.service';

@Component({
  selector: 'sky-input-box-host-service-fixture',
  templateUrl: './input-box-host-service.component.fixture.html',
  standalone: false,
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

  public controlId: string | undefined;

  public hintText: string | undefined = 'Host component hint text.';

  #inputBoxHostSvc: SkyInputBoxHostService;

  constructor(inputBoxHostSvc: SkyInputBoxHostService) {
    this.#inputBoxHostSvc = inputBoxHostSvc;
  }

  public ngOnInit(): void {
    this.#inputBoxHostSvc.populate({
      inputTemplate: this.inputTemplate!,
      buttonsTemplate: this.buttonsTemplate,
    });
    this.#inputBoxHostSvc.setHintText(this.hintText);

    this.controlId = this.#inputBoxHostSvc.controlId;
  }

  public setHintTextHidden(hide: boolean): void {
    this.#inputBoxHostSvc.setHintTextHidden(hide);
  }

  public setHintTextScreenReaderOnly(hide: boolean): void {
    this.#inputBoxHostSvc.setHintTextScreenReaderOnly(hide);
  }

  public containsElement(el: EventTarget): boolean {
    return this.#inputBoxHostSvc.focusIsInInput(el);
  }

  public queryInputBox(query: string): HTMLElement | undefined {
    return this.#inputBoxHostSvc.queryHost(query);
  }
}
