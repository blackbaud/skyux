//#region imports

import { Injectable, Optional } from '@angular/core';

import { BBAuthClientFactory } from '@skyux/auth-client-factory';

import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import jwtDecode from 'jwt-decode';

import { SkyAuthGetTokenArgs } from './auth-get-token-args';

import { SkyAuthToken } from './auth-token';

import { SkyAuthTokenContextArgs } from './auth-token-context-args';

//#endregion

/**
 * Provides methods for getting JWT tokens from the Blackbaud authentication service.
 */
@Injectable()
export class SkyAuthTokenProvider {
  constructor(
    @Optional() private config?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider
  ) {}

  /**
   * Gets a token string from the Blackbaud authentication service.
   * @param args Options for retrieving a token.
   */
  public getToken(args?: SkyAuthGetTokenArgs): Promise<string> {
    return BBAuthClientFactory.BBAuth.getToken(args);
  }

  /**
   * Gets a token object from the Blackbaud authentication service.
   * @param args Options for retrieving a token.
   */
  public getDecodedToken(args?: SkyAuthGetTokenArgs): Promise<SkyAuthToken> {
    return new Promise<SkyAuthToken>((resolve, reject) => {
      this.getToken(args).then((token) => {
        resolve(this.decodeToken(token));
      }, reject);
    });
  }

  /**
   * Gets a token string from the Blackbaud authentication service using the SPA's environment/
   * legal entity context.
   * @param args Provides additional context for retrieving the token.
   */
  public getContextToken(args?: SkyAuthTokenContextArgs): Promise<string> {
    const tokenArgs = this.getContextArgs(args);

    return this.getToken(tokenArgs);
  }

  /**
   * Gets a token object from the Blackbaud authentication service using the SPA's environment/
   * legal entity context.
   * @param args Provides additional context for retrieving the token.
   */
  public getDecodedContextToken(
    args?: SkyAuthTokenContextArgs
  ): Promise<SkyAuthToken> {
    const tokenArgs = this.getContextArgs(args);

    return this.getDecodedToken(tokenArgs);
  }

  /**
   * Decodes a token string.
   * @param token The token string to decode.
   */
  public decodeToken(token: string): SkyAuthToken {
    return jwtDecode<SkyAuthToken>(token);
  }

  private getContextArgs(args: SkyAuthTokenContextArgs): SkyAuthGetTokenArgs {
    const tokenArgs: SkyAuthGetTokenArgs = {};

    const runtimeParams =
      this.config?.runtime.params || this.paramsProvider?.params;

    if (runtimeParams) {
      const envId = runtimeParams.get('envid');
      const leId = runtimeParams.get('leid');

      if (envId) {
        tokenArgs.envId = envId;
      }

      if (leId) {
        tokenArgs.leId = leId;
      }
    }

    if (args && args.permissionScope) {
      tokenArgs.permissionScope = args.permissionScope;
    }

    return tokenArgs;
  }
}
