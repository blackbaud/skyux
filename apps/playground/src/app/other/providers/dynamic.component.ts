import {
  ApplicationRef,
  Component,
  EnvironmentInjector,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef,
  createEnvironmentInjector,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { SkyDynamicComponentService } from '@skyux/core';

import { OtherEmojiModule } from './emoji-other.module';
import { EmojiComponent } from './emoji.component';

@Component({
  standalone: true,
  imports: [OtherEmojiModule],
  selector: 'app-dynamic',
  template: `<ng-template #view />`,
})
export default class DynamicComponent implements OnInit {
  @ViewChild('view', { read: ViewContainerRef, static: true })
  public readonly view!: ViewContainerRef;

  public dynamicComponentSvc = inject(SkyDynamicComponentService);
  public applicationRef = inject(ApplicationRef);

  constructor(
    public readonly injector: Injector,
    public readonly envInjector: EnvironmentInjector
  ) {}

  public ngOnInit(): void {
    // this.view.createComponent(EmojiComponent, {
    //   injector: this.injector,
    // });

    // this.view.createComponent(EmojiComponent, {
    //   injector: this.injector,
    //   environmentInjector: this.envInjector,
    // });

    const envProviders = [importProvidersFrom([OtherEmojiModule])];

    const environmentInjector = createEnvironmentInjector(
      envProviders,
      this.envInjector
    );

    this.view.createComponent(EmojiComponent, {
      injector: environmentInjector,
    });

    // const ref = createComponent(EmojiComponent, {
    //   environmentInjector: this.envInjector,
    // });

    // this.applicationRef.attachView(ref.hostView);

    // ref.changeDetectorRef.markForCheck();
  }
}
