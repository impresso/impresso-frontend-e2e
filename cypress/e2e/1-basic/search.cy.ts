describe('Search', () => {
  let isDataVersion2 = false
  let isNewImageProxy = false
  beforeEach(() => {
    const isDev = Cypress.env('BASE_URL') == null || Cypress.env('BASE_URL').includes('dev.impresso-project.ch')
    isDataVersion2 = isDev
    isNewImageProxy = isDev
    cy.ensureLoggedIn()
  })
  afterEach(() => {
    cy.ensureNoErrors()
  })

  it('Search for "Impresso" yields expected number of results with expected elements in the list', () => {
    // Term: Impresso, Source: Die Tat
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the number of search results
    // Human readable search summary
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/6 articles found containing Impresso/)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // check the number of items in the search results
    cy.get('[data-testid="search-results-list-items"] > div').as('searchResults')
    cy.get('@searchResults').should('have.length', 6)


    // select the first search result
    cy.get('@searchResults').first().find('[data-testid="search-results-list-item"]').as('firstSearchResultListItem')
    cy.get('@searchResults').first().next().find('[data-testid="search-results-list-item"]').as('secondSearchResultListItem')

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('DKSI Nachrichten')

    // check the content of the first search result
    cy.get('@firstSearchResultListItem').find('.article-matches').contains('05 Impresso 9')

    // check the image
    cy.get('@firstSearchResultListItem').find('.IIIFFragment img')
      .should('have.attr', 'src')
      .and('include', isNewImageProxy ? 'blob:https://' : 'https://impresso-project.ch/api/proxy/iiif/DTT-1978-06-21-a-p0023')

    // check the image is loaded and is visible
    cy.get('@firstSearchResultListItem').find('.IIIFFragment img')
      .should('be.visible') // Ensure image is visible before checking dimensions
      .invoke('prop', 'naturalWidth')
      .should('be.greaterThan', 0);


    // check the newspaper
    cy.get('@firstSearchResultListItem').find('.MediaSourceLabel a span:first-child').should('have.text', 'Die Tat')
    cy.get('@firstSearchResultListItem').find('.MediaSourceLabel a').should('have.attr', 'href').and('include', '/newspapers/DTT')

    // check the date
    cy.get('@firstSearchResultListItem').find('[data-testid="article-date"]').should('have.text', 'Wednesday, June 21, 1978')
    // check the pages count
    cy.get('@firstSearchResultListItem').find('[data-testid="article-pages-count"]').contains('p.23')

    // access rights
    const expectedAccessRights = isDataVersion2 ? 'not specified (no export) — provided by Migros' : 'Personal use — provided by Migros'
    cy.get('@firstSearchResultListItem').find('[data-testid="article-access-rights"]').contains(expectedAccessRights)

    // entities
    // TODO: not yet ready in v2
    if (!isDataVersion2) {
      // locations
      const locations = []
      cy.get("@secondSearchResultListItem")
        .find('[data-testid="article-locations"]')
        .find('.ItemSelector_label')
        .each(($li) => locations.push($li.text()))
      cy.wrap(locations)
        .should('deep.equal', ['Basel', 'Paris'])

      // people
      const people = []
      cy.get("@firstSearchResultListItem")
        .find('[data-testid="article-persons"]')
        .find('.ItemSelector_label')
        .each(($li) => people.push($li.text()))
      cy.wrap(people)
        .should('deep.equal', ['Helmut Qualtinger'])

    }
  })

  it('Result list display controls work as expected', () => {
    // Term: Impresso, Source: Die Tat
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
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
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('DKSI Nachrichten')


    // test order by: oldest first
    cy.get('[data-testid="order-by-dropdown"] > .btn').click()
    cy.get('[data-testid="order-by-dropdown"] > .dropdown-menu a').contains('publication date, oldest first').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('RnvdOTIO')


    // test order by: relevance
    cy.get('[data-testid="order-by-dropdown"] > .btn').click()
    cy.get('[data-testid="order-by-dropdown"] > .dropdown-menu a').contains('relevance').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // check the title of the first search result
    cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('DKSI Nachrichten')
    

    // pagination
    // search for Impresso only to have more than one page
    const paginatingQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbw=='
    cy.visit(`/search?sq=${paginatingQuery}&orderBy=-date`)

    // 1st page is active
    cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-1"]')
      .should('have.class', 'active')

    cy.get('@firstSearchResultListItem')
      .find('[data-testid="article-title"] > a')
      .invoke('text')
      .then(firstPageSearchResultTitle => {

        cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-3"] > .page-link')
        .click()
  
        // wait for the loading indicator to disappear
        cy.get('#app-loading').should('not.exist')  
    
        // check the title of the first search result
        cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').invoke('contents').should('not.eq', firstPageSearchResultTitle)
        // cy.get('@firstSearchResultListItem').find('[data-testid="article-title"]').contains('La crescente marea della mano d\'opera estera')
    
        // 3rd page is active
        cy.get('.float-left > [data-testid="pagination-container"] > [data-testid="page-3"]')
        .should('have.class', 'active')
      })
  })

  it('Autocomplete works with search pills', () => {
    // TODO: entities not enabled in v2 yet
    if (isDataVersion2) return

    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('[data-testid="search-pills"]').as('searchPills')

    // only 2 search pills (Impresso and Die Tat) should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 2)

    // check the search pill content
    cy.get('@searchPills')
      .find('[data-testid="search-pill-string"]')
      .contains('Impresso')
      .should('exist')

    // Add Paris
    cy.get('[data-testid="autocomplete-input"]').type('Paris')
    cy.get('.suggestions .location').contains('Paris').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // 2 search pills should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 3)

    // check the search pill content - impresso
    cy.get('@searchPills')
      .find('[data-testid="search-pill-string"]')
      .contains('Impresso')
      .should('exist')

    // check the search pill content - paris
    cy.get('@searchPills')
      .find('[data-testid="search-pill-location"]')
      .contains('Paris')
      .as('parisPill')
    
    cy.get('@parisPill').should('exist')

    // Human readable search summary
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/2 articles found containing Impresso published in Die Tat mentioning Paris/)

    // remove Paris
    cy.get('@parisPill').click()    
    cy.get('@parisPill')
      .parent('[data-testid="search-pill-location"]')
      .find('button')
      .contains('remove')
      .click()
    
    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    // only 2 search pills (Impresso and Die Tat) should be present
    cy.get('@searchPills').find('.search-pill').should('have.length', 2)

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

        // check that we have at least 38,000,000 articles
        cy.wrap(parsedNumber).should('be.greaterThan', 38000000)
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
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // make sure the timeline is visible (it renders the peak)
    cy.get('[data-testid="timeline"] svg .peak text').should('have.text', 2)

    // enter different range
    cy.get('[data-testid="add-new-date-filter-button"]').click()

    cy.get('#start-date-datepicker').clear().type('1800-01-01')
    cy.get('#end-date-datepicker').clear().type('1980-01-01')

    cy.get('.filter-timeline button').contains('Apply').click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    cy.get('section.search-results-summary').contains(/6 articles found containing Impresso/)

    // 3 search pill (impresso + Die Tat + front page) should be present
    cy.get('[data-testid="search-pills"]')
      .find('.search-pill')
      .should('have.length', 3)
  
    cy.get('[data-testid="search-pill-daterange"] .label').should('have.text', 'From Jan 1, 1800 to Jan 1, 1980')
  })

  it('Date filter timeline tooltip works', () => {
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // hover over the peak
    cy.get('[data-testid="timeline"] svg .axis--x .tick').should('have.length.greaterThan', 1)
    cy.get('[data-testid="timeline"] svg').trigger('mousemove', { position: 'center' })

    cy.get('[data-testid="timeline"] .tooltip.active').should('exist')

  })

  it('Content length filter works', () => {
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')  

    // make sure the histogram is visible (it renders the peak)
    cy.get('[data-testid="filter-range"] svg .bars .bar').should('have.length.greaterThan', 1)
    cy.get('[data-testid="filter-range"] svg .maxval text').should('have.text', '100 (1 results)')


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

    cy.get('section.search-results-summary').contains(isDataVersion2 ? /2 articles found containing Impresso/ : /3 articles found containing Impresso/)

    cy.get('[data-testid="search-pill-contentLength"] .label').should('have.text', 'Content length between 1,435 and 4,364')

    // reset 
    cy.get('[data-testid="filter-range"] button').contains('Reset').click()

    cy.get('[data-testid="search-pill-contentLength"]').should('not.exist')
    cy.get('section.search-results-summary').contains(/6 articles found containing Impresso/)

  })

  it('Language filter works', () => {
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 


    // filter by language
    cy.get('[data-testid="facet-filter-language"] [data-testid="expand-collapse-button"]').click()

    cy.get('[data-testid="facet-filter-language"] .FilterFacetBucket .ItemLabel')
      .contains('German')
      .siblings('span')
      .contains('6 results')
      .should('exist')

    cy.get('[data-testid="facet-filter-language"] .FilterFacetBucket .ItemLabel')
      .contains('German')
      .parent()
      .siblings('.custom-checkbox')
      .click()

    cy.get('[data-testid="facet-filter-language"] button')
      .contains('Apply')
      .click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    cy.get('section.search-results-summary').contains(/6 articles found containing Impresso published in Die Tat written in German/)

    cy.get('[data-testid="search-pill-language"] .label').should('have.text', 'German')

    cy.get('[data-testid="facet-filter-language"] [data-testid="remove-filter-button"]')
      .click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist')

    cy.get('[data-testid="search-pill-language"]').should('not.exist')
    cy.get('section.search-results-summary').contains(/6 articles found containing Impresso/)
  })

  it("Entity monitor works", () => {
    // TODO: entities not enabled in v2 yet
    if (isDataVersion2) return

    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 

    cy.get(".ItemSelector").contains("Pyotr Ilyich Tchaikovsky").click()

    cy.get(".SelectionMonitor .d3-timeline .peak text").should("have.text", "33")
  })

  it("Can add similar words", () => {
    const impressoSearchQuery = 'CgIYAgoQEAIYByABKghJbXByZXNzbwoJEAIYCSoDRFRU'
    cy.visit(`/search?sq=${impressoSearchQuery}&orderBy=-date`)
    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 

    cy.get('[data-testid="add-similar-words-button"]').click()

    cy.get('.modal input[name="inputEmbeddings"]').type("banana")
    cy.get('.modal .embeddings a').contains("duck").click()

    // wait for the loading indicator to disappear
    cy.get('#app-loading').should('not.exist') 

    // there is a new pill
    cy.get('[data-testid="search-pill-string"] .label').contains("duck").should('exist')

    // modal is closed when clicked close
    cy.get(".modal .embeddings").should("exist")
    cy.get('.modal [aria-label="Close"]').click()
    cy.get(".modal .embeddings").should("not.exist")

    cy.get('section.search-results-summary').contains(/Sorry, no articles found containing Impresso AND duck/)
  })
})