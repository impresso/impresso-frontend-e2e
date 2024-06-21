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
})