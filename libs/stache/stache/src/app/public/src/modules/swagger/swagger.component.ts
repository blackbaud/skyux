import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwaggerConfig } from './swagger-config';
const swagger = require ('swagger-ui-dist');

@Component({
  selector: 'stache-swagger',
  templateUrl: './swagger.component.html'
})
export class StacheSwaggerComponent implements OnInit, AfterViewInit {
  @Input()
  public swaggerUrl: string;

  @ViewChild('swaggerWrapper')
  public swaggerWrapper: any;

  private swaggerConfig: SwaggerConfig = {
    layout: 'StandaloneLayout',
    presets: [
      swagger.SwaggerUIBundle.presets.apis,
      swagger.SwaggerUIStandalonePreset
    ],
    plugins: [
      swagger.SwaggerUIBundle.plugins.DownloadUrl
    ]
  };

  public ngOnInit(): void {
    this.swaggerConfig.url = this.swaggerUrl;
    this.swaggerConfig.domNode = this.swaggerWrapper.nativeElement;
  }

  public ngAfterViewInit(): void {
    swagger.SwaggerUIBundle(this.swaggerConfig);
  }
}
