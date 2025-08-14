
describe('Impresso Search Functionality', () => {

  beforeEach(() => {
    cy.ensureLoggedIn();
    cy.acceptTermsAndCookies();
    cy.visit('https://dev.impresso-project.ch/app/search');
    
  });

  it('should allow a user to search for the keyword "peace" and see results', () => {
    const searchTerm = 'peace';
    cy.get('[data-testid="autocomplete-input"]').type(searchTerm);
    cy.get('[data-testid="add-keyword-button"]').click();
    cy.get('[data-testid="search-pills"]').should('be.visible');
    cy.get('[data-testid="search-pill-string"]').should('contain', searchTerm);
    
  });

  
  context('When a search has been performed', () => {

    beforeEach(() => {
      const searchTerm = 'peace';
      cy.get('[data-testid="autocomplete-input"]').type(searchTerm);
      cy.get('[data-testid="add-keyword-button"]').click();
      cy.get('[data-testid="search-pill-string"]').should('be.visible');
    });

    it('should open the dropdown menu, allow toggling the condition, and apply the change', () => {
      
      cy.contains('[data-testid="search-pill-string"]', 'peace')
        .find('button.dropdown-toggle')
        .click();
      cy.contains('div.custom-radio', 'Contains').find('input[type="radio"]').should('be.checked');
      cy.contains('div.custom-radio', 'NOT contains').find('input[type="radio"]').should('not.be.checked');
      
      cy.contains('label', 'NOT contains').click();
     
      cy.contains('button', 'Apply changes').click();
      
      cy.get('[data-testid="search-pill-string"]').should('contain.text', 'NOT');
    });

   
    it('should reset the search when the reset filters button is clicked', () => {
      
      cy.get('[data-testid="search-pill-string"]').should('exist');

        cy.get('[data-testid="reset-filters-button"]').filter(':visible').click();
      
      cy.get('[data-testid="search-pill-string"]').should('not.exist');
    });

   it('should add the suggested word "army" to the search pill', () => {
      const suggestedWord = 'army';
      const originalWord = 'peace';
      cy.contains('[data-testid="search-pill-string"]', originalWord)
        .find('button.dropdown-toggle')
        .click();

        cy.contains('button', 'add similar').click();
        cy.contains('a', suggestedWord).click();
        cy.get('.dropdown-menu.show').contains(suggestedWord).should('be.visible');
        
        cy.contains('button', 'apply changes (added: 1, removed: 0)').scrollIntoView().click();

      cy.get('[data-testid="search-pill-string"]')
        .should('contain.text', originalWord)
        .and('contain.text', suggestedWord);
        cy.get('[data-testid="search-pill-string"]')
    .find('button.dropdown-toggle')
    .click();

  cy.get('.dropdown-menu').should('not.be.visible');

  cy.get('#app-loading').should('not.exist')  

    
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/10,133 articles found containing peace or army/)
    cy.get('#app-loading').should('not.exist')

    });


      it('should add a new word to the search, save it and allow toggling the global search condition', () => {
        const newWord = 'war';
     const originalWord = 'peace';
      cy.contains('[data-testid="search-pill-string"]', originalWord)
        .find('button.dropdown-toggle')
        .click();

     cy.contains('button', 'add new').click();
      cy.get('.strings-to-add input[type="text"]').type(`${newWord}{enter}`);
      cy.scrollTo('bottom');
      cy.contains('button', 'apply changes (added: 1, removed: 0)').click();
      
        cy.contains('div.custom-radio', 'all of the following').find('input[type="radio"]').should('not.be.checked');
      cy.contains('div.custom-radio', 'at least one of the following').find('input[type="radio"]').should('be.checked');

      cy.contains('label', 'all of the following').click();
      cy.contains('button', 'Apply changes').click();
  cy.get('[data-testid="search-pill-string"]')
    .find('button.dropdown-toggle')
    .click();

  cy.get('.dropdown-menu').should('not.be.visible');

  
  cy.get('#app-loading').should('not.exist')  

    
    cy.get('section.search-results-summary').should('exist')
    cy.get('section.search-results-summary').contains(/292 articles found containing peace and war/)
    cy.get('#app-loading').should('not.exist')

    });
  });
});