export interface SkyAuthToken {
  /**
   * The subject of the token and contains the user's Blackbaud Authentication Id (GUID).
   */
  sub?: string;

  /**
   * The user's email address.
   */
  email?: string;

  /**
   * The first name of the user.
   */
  given_name?: string;

  /**
   * The last name of the user.
   */
  family_name?: string;

  /**
   * Blackbaud session ID.
   */
  '1bb.session_id'?: string;

  /**
   * Single permission or array of permissions based on the provided permission scope.
   */
  '1bb.perms'?: number | number[];

  /**
   * The environment ID provided when the token was created.
   */
  '1bb.environment_id'?: string;

  /**
   * The legal entity ID provided when the token was created.
   */
  '1bb.legal_entity_id'?: string;

  /**
   * The permission scope provided when the token was created.
   */
  '1bb.permission_scope'?: string;

  /**
   * The zone that the environment is in.
   */
  '1bb.zone'?: string;

  /**
   * Single entitlement or array of entitlements based on the provided permission scope.
   */
  '1bb.entitlements'?: string | string[];

  /**
   * The time that the token expires and consumers should not accept the token.
   */
  exp?: number;

  /**
   * The time that the JWT was created.
   */
  iat?: number;

  /**
   * The issuer of the token (the Authentication Service).
   */
  iss?: string;

  /**
   * The intended audience of the JWT.
   */
  aud?: string;
}
