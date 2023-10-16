export type { SkyAvatarSize } from './lib/modules/avatar/avatar-size';
export type { SkyAvatarSrc } from './lib/modules/avatar/avatar-src';
export { SkyAvatarModule } from './lib/modules/avatar/avatar.module';

// Now that the SkyAutonumericDirective is standalone it can be exported directly thus removing the need to
// import the SkyAvatarModule in the consuming application.
export { SkyAvatarComponent } from './lib/modules/avatar/avatar.component';
