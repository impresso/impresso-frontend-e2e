// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const maybeParse = (value?: string) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return
  }
}

interface ImpressoLocalStorage {
  __impresso__settings?: string
}

Cypress.Commands.add('acceptTermsAndCookies', () => {
  cy.getAllLocalStorage().then((result: ImpressoLocalStorage) => {
    const impressoSettings = maybeParse(result.__impresso__settings) ?? {}
    impressoSettings['termsAgreed'] = true
    impressoSettings['cookiesAccepted'] = true

    cy.log('Saving impresso settings', impressoSettings)

    window.localStorage.setItem('__impresso__settings', JSON.stringify(impressoSettings))
  })
})

Cypress.Commands.add('login', (
  redirect?: string,
  doNotWait?: boolean,
  email?: string,
  password?: string,
) => {
  const username = email ?? Cypress.env('USER_EMAIL')
  const userPassword = password ?? Cypress.env('USER_PASSWORD')
  const redirectDestination = redirect ?? '/'
  const prefix = new URL(Cypress.config().baseUrl).pathname

  cy.clearAllCookies()
  cy.visit(`/login?redirect=${prefix}${redirectDestination}`)

  cy.get('[type="email"]').type(username)
  cy.get('[type="password"]').type(userPassword)
  cy.get('.btn').contains('Sign in').click()

  // do not wait for successful log-in.
  // useful for testing the error path
  if (doNotWait) return

  // wait for it to log in and verify the name is in the header
  cy.get('.TheHeader__userArea .user-fullname').should('exist')
})


Cypress.Commands.add('logout', () => {
  cy.visit('/user/logout')

  cy.get('.TheHeader__userArea .nav-link .small-caps').first().should('have.text', 'login')
})