export { SkyAutonumericOptionsProvider } from './lib/modules/autonumeric/autonumeric-options-provider';
export { SkyAutonumericOptions } from './lib/modules/autonumeric/autonumeric-options';
export { SkyAutonumericModule } from './lib/modules/autonumeric/autonumeric.module';

// Now that the SkyAutonumericDirective is standalone it can be exported directly thus removing the need to
// import the SkyAutonumericModule in the consuming application.
export { SkyAutonumericDirective } from './lib/modules/autonumeric/autonumeric.directive';
