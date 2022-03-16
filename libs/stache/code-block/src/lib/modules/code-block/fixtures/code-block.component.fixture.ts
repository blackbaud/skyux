import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-component',
  templateUrl: './code-block.component.fixture.html',
})
export class SkyCodeBlockTestComponent {
  public code = `
  $(document).ready(() => {
    console.log('jQuery is ready!');
  });
  <p>Hello, {{name}}!</p>
  <script>
    import { Component } from '@angular/core';
    @Component({ selector: 'my-component' })
    export class MyComponent {}
  </script>
`;
}
