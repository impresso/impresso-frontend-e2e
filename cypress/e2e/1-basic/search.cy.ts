describe('Search', () => {
  beforeEach(() => {
    cy.ensureLoggedIn()
  })
  afterEach(() => {
    cy.ensureNoErrors()
  })


  xit('Search for "Impresso" yields expected number of results with expected elements in the list', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the number of search results
    // Human readable search summary
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/56 articles found containing impresso/)

    // TODO: move interaction to another test
    // // test order by
    // cy.get('[data-testid="order-by-dropdown"] > .btn').click()
    // cy.get('[data-testid="order-by-dropdown"] > .dropdown-menu a').contains('publication date, most recent first').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // check the number of items in the search results
    cy.get('[data-testid="search-results-list-items"] > div').as('searchResults')
    cy.get('@searchResults').should('have.length', 25)


    // select the first search result
    cy.get('@searchResults').first().find('[data-testid="search-results-list-item"]').as('firstSearchResultListItem')

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('3+')

    // check the content of the first search result
    cy.get('@firstSearchResultListItem').find('.article-matches').contains('Impresso ™ ri viaggio 16')

    // check the image
    cy.get('@firstSearchResultListItem').find('.IIIFFragment img')
      .should('have.attr', 'src')
      .and('include', 'https://impresso-project.ch/api/proxy/iiif/FZG-2006-12-27-a-p0009')

    // check the image is loaded and is visible
    cy.get('@firstSearchResultListItem').find('.IIIFFragment img')
      .should('be.visible') // Ensure image is visible before checking dimensions
      .invoke('prop', 'naturalWidth')
      .should('be.greaterThan', 0);


    // check the newspaper
    cy.get('@firstSearchResultListItem').find('.article-newspaper').should('have.text', 'Freiburger Nachrichten')
    cy.get('@firstSearchResultListItem').find('.article-newspaper').should('have.attr', 'href').and('include', '/newspapers/FZG')

    // check the date
    cy.get('@firstSearchResultListItem').find('[data-testid="article-date"]').should('have.text', 'Wednesday, December 27, 2006')
    // check the pages count
    cy.get('@firstSearchResultListItem').find('[data-testid="article-pages-count"]').contains('p.9')

    // access rights
    cy.get('@firstSearchResultListItem').find('[data-testid="article-access-rights"]').contains('Personal use — provided by Swiss National Library')

    // entities

    // locations
    const locations = []
    cy.get("@firstSearchResultListItem")
      .find('[data-testid="article-locations"]')
      .find('.ItemSelector_label')
      .each(($li) => locations.push($li.text()))
    cy.wrap(locations)
      .should('deep.equal', ['Wetter, Hesse', 'Las Vegas Strip', 'California'])

    // people
    const people = []
    cy.get("@firstSearchResultListItem")
      .find('[data-testid="article-persons"]')
      .find('.ItemSelector_label')
      .each(($li) => people.push($li.text()))
    cy.wrap(people)
      .should('deep.equal', ['Leonardo DiCaprio', 'Robbie Williams'])
  })

})