import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-dynamic-component-demo-example',
  template: '(Injected component content.)'
})
export class DynamicComponentDemoExampleComponent {
  public sayHello(): void {
    console.log('Hello!');
  }
}
