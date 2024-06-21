describe('Newspapers', () => {
  beforeEach(() => {
    cy.ensureLoggedIn()
  })
  afterEach(() => {
    cy.ensureNoErrors()
  })

  it('Default page shows a list of newspapers with a timeline', () => {
    cy.visit('/newspapers')

    // reference newspapers list
    cy.get('.i-layout-section .body .items .newspaper-item').as('newspapers')
    
    // there should be at least one newspaper
    cy.get('@newspapers').should('have.length.greaterThan', 0)
    // there should be a known newspaper
    cy.get('@newspapers').contains('Gazette de Lausanne').should('exist')
  
  
    // reference newspaper lines
    cy.get('.i-layout-section .body .lines .n').as('newspaperLines')

    // there should be at least one newspaper line
    cy.get('@newspaperLines').should('have.length.greaterThan', 0)
    
    // there should be a known newspaper line
    cy.get('@newspaperLines').contains('Gazette de Lausanne').parent().as('knownLine')
    cy.get('@knownLine').should('exist')
    // this line should have a known date range
    cy.get('@knownLine').find('.label-start').should('have.text', '1804')
    cy.get('@knownLine').find('.label-end').should('have.text', '1991')

    // there should be a timeline with ticks
    cy.get('.d3-timeline .axis--x .tick').should('have.length.greaterThan', 0)
  })
})