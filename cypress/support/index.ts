export {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Accept all banners: terms and cookies
       */
      acceptTermsAndCookies(): Chainable<JQuery<HTMLElement>>
      /**
       * Log in to the application using default credentials
       * from the environment variables or the overridden ones
       * provided as arguments.
       * @param redirect - URL to redirect to after login (default: '/')
       * @param doNotWait - Do not wait for the login to complete successfully (default: false)
       */
      login(redirect?: string, doNotWait?: boolean, email?: string, password?: string): Chainable<JQuery<HTMLElement>>
      logout(): Chainable<JQuery<HTMLElement>>
    }
  }
}