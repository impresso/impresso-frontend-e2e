beforeEach(() => {
  cy.acceptTermsAndCookies()
})

describe('Authentication', () => {
  it('user successfully logs in and logs out', () => {
    cy.login()
    cy.visit('/')
    cy.get('.TheHeader__userArea .user-picture').should('exist')
    cy.get('.HomePage__hugeHeading').contains('Media Monitoring of the Past')
    cy.logout()
  })

  it('an unknown user cannot log in', () => {
    cy.login(undefined, true, 'unknown.user@impresso-project.ch', 'nothing')

    // there is an error
    cy.get('#UserLoginPage .alert-danger').as('error')
    cy.get('@error').should('contain.text', 'Login Failed!')

    // there is still a login link (not logged in)
    cy.get('.TheHeader__userArea .nav-link .small-caps').first().should('have.text', 'login')
  })
})