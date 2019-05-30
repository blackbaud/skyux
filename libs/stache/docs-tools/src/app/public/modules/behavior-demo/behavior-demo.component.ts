import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import {
  SkyDocsBehaviorDemoControlPanelConfig
} from './behavior-demo-control-panel-config';

@Component({
  selector: 'sky-docs-behavior-demo',
  templateUrl: './behavior-demo.component.html',
  styleUrls: ['./behavior-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsBehaviorDemoComponent implements OnInit, OnDestroy {

  @Input()
  public controlPanelConfig: SkyDocsBehaviorDemoControlPanelConfig;

  @Output()
  public selectionChange = new EventEmitter<SkyDocsBehaviorDemoControlPanelConfig>();

  private initialControlPanelConfig: SkyDocsBehaviorDemoControlPanelConfig;

  public ngOnInit(): void {
    if (this.controlPanelConfig) {
      this.initialControlPanelConfig = this.cloneConfig(this.controlPanelConfig);
    }
  }

  public ngOnDestroy(): void {
    this.selectionChange.complete();
  }

  public onModelChange(): void {
    this.selectionChange.emit(this.controlPanelConfig);
  }

  public onResetButtonClick(): void {
    this.controlPanelConfig = this.cloneConfig(this.initialControlPanelConfig);
  }

  private cloneConfig(config: SkyDocsBehaviorDemoControlPanelConfig): SkyDocsBehaviorDemoControlPanelConfig {
    return JSON.parse(JSON.stringify(config));
  }

}
