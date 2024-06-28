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

 xit('Result list display controls work as expected', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // select the first search result
    cy.get('[data-testid="search-results-list-items"] > div').as('searchResults')
    cy.get('@searchResults')
      .first()
      .find('[data-testid="search-results-list-item"]')
      .as('firstSearchResultListItem')

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('3+')


    // test order by: oldest first
    cy.get('[data-testid="order-by-dropdown"] > .btn').click()
    cy.get('[data-testid="order-by-dropdown"] > .dropdown-menu a').contains('publication date, oldest first').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('Chambre » avec la pension,')


    // test order by: relevance
    cy.get('[data-testid="order-by-dropdown"] > .btn').click()
    cy.get('[data-testid="order-by-dropdown"] > .dropdown-menu a').contains('relevance').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('UNKNOWN')
    

    // pagination

    // 1st page is active
    cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-1"]')
      .should('have.class', 'active')

    cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-3"] > .page-link')
      .click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  


    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('La crescente marea della mano d\'opera estera')

    // 3rd page is active
    cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-3"]')
    .should('have.class', 'active')
  })

  it('Autocomplete works with search pills', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('[data-testid="search-pills"]').as('searchPills')

    // only 1 search pill (impresso) should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 1)

    // check the search pill content
    cy.get('@searchPills')
      .find('[data-testid="search-pill-string"]')
      .contains('impresso')
      .should('exist')

    // Add Paris
    cy.get('[data-testid="autocomplete-input"]').type('Paris')
    cy.get('.suggestions .location').contains('Paris').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // 2 search pills should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 2)

    // check the search pill content - impresso
    cy.get('@searchPills')
      .find('[data-testid="search-pill-string"]')
      .contains('impresso')
      .should('exist')

    // check the search pill content - paris
    cy.get('@searchPills')
      .find('[data-testid="search-pill-location"]')
      .contains('Paris')
      .as('parisPill')
    
    cy.get('@parisPill').should('exist')

    // Human readable search summary
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/4 articles found containing impresso mentioning Paris/)

    // remove Paris
    cy.get('@parisPill').click()    
    cy.get('@parisPill')
      .parent('[data-testid="search-pill-location"]')
      .find('button')
      .contains('remove')
      .click()
    
    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // only 1 search pill (impresso) should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 1)

    // remove everything
    cy.get('[data-testid="reset-filters-button"]').first().click()
    // wait for the loading indicator to disappear
    cy.get('#app-loading', {
      timeout: 10000 // long timeout because we are loading lots of data
    }).should('not.exist')

    // 0 search pills should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 0)

    // lots of articles found
    cy.get('section.search-results-summary')
      .invoke('text')
      .then((text) => {
        const textParts = text.split(' ')
        const numberPart = textParts[0].replace(/,/g, '')
        const parsedNumber = parseInt(numberPart, 10)

        // check that we have at least 40,000,000 articles
        cy.wrap(parsedNumber).should('be.greaterThan', 40000000)
      })

  })

})