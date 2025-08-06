/// <reference types="cypress" />


describe('Impresso Article Viewer', () => {
  beforeEach(() => {
    cy.ensureLoggedIn()
    cy.visit('https://dev.impresso-project.ch/app/issue/LLE-1964-02-01-a/view?sq=CgIYAgoWEAIYByABKg5qZXV4IG9seW1waXF1ZQ==&articleId=i0248&p=30&text=2');


    cy.get('#app-content', { timeout: 15000 }).should('be.visible');
    cy.get('.MediaSourceLabel', { timeout: 15000 }).should('be.visible');
  });



  context('Main Article Metadata', () => {
it('should display the correct newspaper title, date, and page number', () => {

const headerContainer = cy.get('div.header .navbar');
headerContainer.should('be.visible');


  headerContainer.within(() => {
    
    cy.get('.MediaSourceLabel')
      .should('be.visible')
      .and('contain.text', 'La Liberté');

    
    cy.get('span.date')
      .should('be.visible')
      .and('contain.text', 'Saturday, February 1, 1964');

    cy.get('span.pages')
      .should('be.visible')
      .and('contain.text', 'p.30');

  
    cy.get('h3 > b')
      .should('be.visible')
      .and('contain.text', 'un bon CHAUFFEUR pour camion basculant');
  });
});

it('should display the article type and data provider information', () => {
    

  const articleInfoContainer = cy.get(
    '.i-layout-section.border-left .d-flex.align-items-center:has(div.DataProviderLabel)'
  );

  
  articleInfoContainer.within(() => {
    
    cy.contains('span.small-caps', 'article').should('be.visible');

    
    cy.get('div.DataProviderLabel')
      .should('be.visible')
      .and('contain.text', 'provided by');

    cy.get('button.ItemSelector').should('be.visible');
  });
});

it('should have a working "Add to Collection" button', () => {
    cy.get('button').contains('Add to collection').should('be.visible').and('not.be.disabled');
});

}); 

context('Table of Contents (Left Sidebar)', () => {

  it('should display the Table of Contents panel with a title, search, and item count', () => {

    
    const leftSidebar = cy.get('.i-layout-section:not(.border-left)');

    leftSidebar.within(() => {
      
      
      cy.get('a[aria-current="page"]')
        .should('be.visible')
        .and('contain.text', 'Table of Contents');

      
      cy.get('div.tab-content').within(() => {
        
       
        cy.contains('label', 'Add Current Search Filters').should('be.visible');
        
        
        cy.get('input[placeholder="... search in current issue"]').should('be.visible');
        cy.contains('button', 'search').should('be.visible');
        
       
        cy.contains(/\d+ content items/).should('be.visible');
      });
    });
  });

  
it('should highlight the currently active article in the list', () => {
  
  cy.get('.i-layout-section:not(.border-left)').within(() => {
    
    cy.get('.issue-viewer-table-of-contents').within(() => {

      
      cy.get('.media.active')
        .should('be.visible') 
        .and('contain.text', 'un bon CHAUFFEUR pour camion basculant');
    });
  });
});
 

 context('Marginalia (Entities and Topics)', () => {

  
it('should display named entities for Persons', () => {

  // Start inside the main content column to ignore the sidebar.
  cy.get('.i-layout-section.border-left').within(() => {
    
    // --- THIS IS THE DIRECT FIX ---

    // 1. Find all 11 "Persons" containers.
    cy.get('div.contents:has(span.badge:contains("persons"))')
      // 2. Use .first() to FORCIBLY select only the very first one it finds.
      .first()
      // 3. Now, call .within() on that SINGLE element.
      .within(() => {
    
        // These assertions will now run inside the correct, single container.
        cy.contains('span.ItemSelector_label', 'Alexander von Humboldt')
          .should('be.visible');

        cy.contains('span.ItemSelector_label', 'Han Suyin')
          .should('be.visible');
    });
  });
});

  
  it('should display named entities for Locations', () => {
    cy.get('.i-layout-section.border-left').within(() => {
      
      
      cy.get('div.contents:has(span.badge:contains("locations"))').first().within(() => {
      
        cy.contains('span.ItemSelector_label', 'Canton de Fribourg').should('be.visible');

        
        cy.get('span.ItemSelector_label').should('have.length.gte', 1);
      });
    });
  });

it('should display topics with percentages and labels', () => {


  cy.get('.i-layout-section.border-left').within(() => {
    
    
    cy.get('[data-testid="article-topics"]').first().within(() => {
        
        
        const topicItem = cy.contains('.d-flex.align-items-center', '55.9%');
        topicItem.should('be.visible');
        
      
        topicItem.within(() => {

          
          cy.get('div.ItemLabel')
            .should('be.visible')
            
              .should('contain.text', 'tagesschau · sport · bild · les · deutschland');
        });
    });
  });
});
  context('Article Viewer Pane', () => {

  it('should display the view tabs and default to "FACSIMILE + TRANSCRIPT" being active', () => {

    
    cy.get('.IssueViewerPage_tabs').within(() => {
      
      
      cy.contains('button', 'Facsimile').should('be.visible');
      cy.contains('button', 'Region Transcript').should('be.visible');
      cy.contains('button', 'Facsimile + Transcript').should('be.visible');

      
      cy.get('li.active')
        .should('be.visible')
        .and('contain.text', 'Facsimile + Transcript');
    });
  });

 it('should show the facsimile image viewer', () => {
  cy.get('.IIIFViewer').within(() => {
    cy.get('.openseadragon-canvas').should('be.visible');
    
  });
});
});
  });  
  
   });
 });