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
      /**
       * Ensure the user is logged in.
       * If not, log in using default credentials.
       */
      ensureLoggedIn(): Chainable<JQuery<HTMLElement>>

      /**
       * Ensure the user is not logged in (anonymous session).
       */
      ensureLoggedOut(): Chainable<JQuery<HTMLElement>>

      /**
       * Ensure there is no error panel on the page.
       */
      ensureNoErrors(): Chainable<JQuery<HTMLElement>>
    }
  }
}