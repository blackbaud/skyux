export * from './modules/avatar/avatar-size';
export * from './modules/avatar/avatar-src';
export * from './modules/avatar/avatar.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of public API.
export {
  SkyAvatarComponent as λ1
} from './modules/avatar/avatar.component';
