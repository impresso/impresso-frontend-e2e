describe('Search', () => {
  beforeEach(() => {
    cy.ensureLoggedIn()
  })
  afterEach(() => {
    cy.ensureNoErrors()
  })

  it('Search for "Impresso" yields expected results', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // check the number of search results
    cy.get('section.search-results-summary > span > .number').should('have.text', '56')
  })
})