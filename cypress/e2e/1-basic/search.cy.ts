describe('Search', () => {
  beforeEach(() => {
    cy.ensureLoggedIn()
  })
  afterEach(() => {
    cy.ensureNoErrors()
  })

  it('Search for "Impresso" yields expected number of results with expected elements in the list', () => {
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

  it('Result list display controls work as expected', () => {
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

  it('Frontpage toggle works', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('[data-testid="is-frontpage-toggle"]').click()

    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/1 article found containing impresso/)

    // 3 search pill (impresso + front page) should be present
    cy.get('[data-testid="search-pills"]')
      .find('.search-pill')
      .should('have.length', 2)

  })

  it('Date filter works', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // make sure the timeline is visible (it renders the peak)
    cy.get('[data-testid="timeline"] svg .peak text').should('have.text', 14)

    // enter different range
    cy.get('[data-testid="add-new-date-filter-button"]').click()

    cy.get('#start-date-datepicker').clear().type('1800-01-01')
    cy.get('#end-date-datepicker').clear().type('1980-01-01')

    cy.get('.filter-timeline button').contains('Apply').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('section.search-results-summary').contains(/15 articles found containing impresso/)

    // 3 search pill (impresso + front page) should be present
    cy.get('[data-testid="search-pills"]')
      .find('.search-pill')
      .should('have.length', 2)
  
    cy.get('[data-testid="search-pill-daterange"] .label').should('have.text', 'From Jan 1, 1800 to Jan 1, 1980')
  })

  it('Date filter timeline tooltip works', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // hover over the peak
    cy.get('[data-testid="timeline"] svg .axis--x .tick').should('have.length.greaterThan', 1)
    cy.get('[data-testid="timeline"] svg').trigger('mousemove', { position: 'center' })

    cy.get('[data-testid="timeline"] .tooltip.active').should('exist')

  })

  it('Content length filter works', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // make sure the histogram is visible (it renders the peak)
    cy.get('[data-testid="filter-range"] svg .bars .bar').should('have.length.greaterThan', 1)
    cy.get('[data-testid="filter-range"] svg .maxval text').should('have.text', '200 (11 results)')


    // adjust the range
    cy.get('[data-testid="filter-range"] .vue-slider-dot-handle').first().as('leftHandle')
    cy.get('[data-testid="filter-range"] .vue-slider-dot-handle').last().as('rightHandle')

    cy.get('@leftHandle').trigger('mousedown', { which: 1 })
    cy.get('@leftHandle').trigger('mousemove', { pageX: 80, pageY: 0, force: true })
    cy.get('@leftHandle').trigger('mouseup', { which: 1 })

    cy.get('@rightHandle').trigger('mousedown', { which: 1 })
    cy.get('@rightHandle').trigger('mousemove', { pageX: 180, pageY: 0, force: true })
    cy.get('@rightHandle').trigger('mouseup', { which: 1 })

    cy.get('[data-testid="filter-range"] button').contains('Apply').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('section.search-results-summary').contains(/14 articles found containing impresso/)

    cy.get('[data-testid="search-pill-contentLength"] .label').should('have.text', 'Content length between 1,435 and 4,364')

    // reset 
    cy.get('[data-testid="filter-range"] button').contains('Reset').click()

    cy.get('[data-testid="search-pill-contentLength"]').should('not.exist')
    cy.get('section.search-results-summary').contains(/56 articles found containing impresso/)

  })

  it('Language filter works', () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 


    // filter by language
    cy.get('[data-testid="facet-filter-language"] [data-testid="expand-collapse-button"]').click()

    cy.get('[data-testid="facet-filter-language"] .FilterFacetBucket .ItemLabel')
      .contains('French')
      .siblings('span')
      .contains('10 results')
      .should('exist')

    cy.get('[data-testid="facet-filter-language"] .FilterFacetBucket .ItemLabel')
      .contains('French')
      .parent()
      .siblings('.custom-checkbox')
      .click()

    cy.get('[data-testid="facet-filter-language"] button')
      .contains('Apply')
      .click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    cy.get('section.search-results-summary').contains(/10 articles found containing impresso written in French/)

    cy.get('[data-testid="search-pill-language"] .label').should('have.text', 'French')

    cy.get('[data-testid="facet-filter-language"] [data-testid="remove-filter-button"]')
      .click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    cy.get('[data-testid="search-pill-language"]').should('not.exist')
    cy.get('section.search-results-summary').contains(/56 articles found containing impresso/)
  })

  it.only("Entity monitor works", () => {
    const impressoSearchQuery = 'ChIIARACGAcgASoIaW1wcmVzc28%3D'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 

    cy.get(".ItemSelector").contains("Leonardo DiCaprio").click()

    cy.get(".SelectionMonitor .d3-timeline .peak text").should("have.text", "910")
  })
})