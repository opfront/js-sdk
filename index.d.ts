// Type definitions for opfront 2.0
// Project: https://github.com/opfront/js-sdk
// Definitions by: Michael Masson <https://github.com/MichaelMass>

export as namespace Opfront;

// Default type for callbacks
type Callback = (err?: object, res?: object) => void;

/**
 * Interface for a ressource
 */
interface IRessource {
  /**
   * Create a ressource
   */
  create(payload: object): Promise<object>;

  /**
   * Create a ressource
   */
  create(payload: object, callback: Callback): void;

  /**
   * List ressources
   */
  list(summary: object, offset: number, size: number, params: object): Promise<object>;

  /**
   * List ressources
   */
  list(summary: object, offset: number, size: number, params: object, callback: Callback);

  /**
   * Get a ressource
   */
  get(id: string, queryParams: object): Promise<object>;

  /**
   * Get a ressource
   */
  get(id: string, queryParams: object, callback: Callback);

  /**
   * Update a ressource
   */
  update(id: string, payload: object): Promise<object>;

  /**
   * Update a ressource
   */
  update(id: string, payload: object, callback: Callback);

  /**
   * Delete a ressource
   */
  delete(id: string): Promise<object>;

  /**
   * Delete a ressource
   */
  delete(id: string, callback: Callback);
}

interface IAuthRessource {
  /**
   * Send a password reset link to the email
   */
  passwordReset(email: string): Promise<object>;

  /**
   * Send a password reset link to the email
   */
  passwordReset(email: string, callback: Callback): void;

  /**
   * Reset the password with the token
   */
  passwordResetWithToken(token: string, payload: object): Promise<object>;

  /**
   * Reset the password with the token
   */
  passwordResetWithToken(token: string, payload: object, callback: Callback): void;
}

interface IUserRessource extends IRessource {
  /**
   * Get the user profile
   */
  me(): Promise<object>;

  /**
   * Get the user profile
   */
  me(callback: Callback): void;
}

interface IApiVersion {
  /**
   * Get the api version
   */
  get(): Promise<object>;

  /**
   * Get the api version
   */
  get(callback: Callback): void;
}

interface IConnectorRessource {
  /**
   * Set the connector for the specified store
   */
  setStoreConnector(storeId: number, payload: object): Promise<object>;

  /**
   * Set the connector for the specified store
   */
  setStoreConnector(storeId: number, payload: object, callback: Callback): void;
}

interface IEventRessource {
  /**
   * Track a product when it is viewed
   */
  trackProductViewed(productId: number): Promise<object>;

  /**
   * Track a product when it is viewed
   */
  trackProductViewed(productId: number, callback: Callback): void;
}

/**
 * Authenticate the api user
 */
export function authenticate(username: string, password: string): Promise<void>;

/**
 * Authenticate the api user with a token
 */
export function authenticateWithToken(token: string): Promise<void>;

/**
 * Configure the api endpoint
 */
export function configureUrl(url: string): void;

export const Spectacle: IRessource;
export const Product: IRessource;
export const Order: IRessource;
export const Store: IRessource;
export const Banner: IRessource;
export const Auth: IAuthRessource;
export const User: IUserRessource;
export const Connector: IConnectorRessource;
export const Event: IEventRessource;
export const ApiVersion: IApiVersion;

export const version: string;
