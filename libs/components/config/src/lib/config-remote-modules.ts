import { SkyuxConfigRemoteModulesPublic } from './config-remote-modules-public';
import { SkyuxConfigRemoteModulesReferenced } from './config-remote-modules-referenced';

/**
 * Configuration for projects that consume or expose remote modules.
 * @experimental
 */
export type SkyuxConfigRemoteModules = SkyuxConfigRemoteModulesPublic &
  SkyuxConfigRemoteModulesReferenced & {
    /**
     * Information about dependencies that should be shared between containers.
     * The value for each entry should be an object with properties expected by
     * Webpack's 'ModuleFederationPlugin' constructor.
     * @see https://webpack.js.org/plugins/module-federation-plugin#sharing-libraries
     */
    shared?: { [packageName: string]: Record<string, unknown> };
  };
