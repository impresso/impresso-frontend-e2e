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
    cy.get('.d3-timeline .axis--x .tick', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })

  it('filters the newspaper list by name via the search bar', () => {
    cy.visit('/newspapers')

    const searchInput = 'input[placeholder="filter list of newspapers by name ..."]'
    const listItems = '.i-layout-section .body .items .newspaper-item'
    const knownNewspaper = 'Gazette de Lausanne'

    // Ensure list is initially populated
    cy.get(listItems).should('have.length.greaterThan', 0)
    cy.get(listItems).contains(knownNewspaper).should('exist')

    // Type part of the known newspaper name
    cy.get(searchInput)
      .should('be.visible')
      .clear()
      .type('gazette')

    // Wait for debounce (150ms in your code) + render buffer
    cy.wait(300)

    // Should only show matching items
    cy.get(listItems)
      .should('have.length.greaterThan', 0)
      .contains(knownNewspaper)
      .should('be.visible')

    // Clear search and list resets
    cy.get(searchInput).clear()
    cy.wait(200)
    cy.get(listItems).should('have.length.greaterThan', 0)
  })

  it('shows an empty state for unmatched queries', () => {
    cy.visit('/newspapers')

    const searchInput = 'input[placeholder="filter list of newspapers by name ..."]'
    const listItems = '.i-layout-section .body .items .newspaper-item'
    const emptyState = '.empty-state, .no-results' // adjust if you have a dedicated element

    cy.get(searchInput).clear().type('zzzzzz-not-a-paper')
    cy.wait(300)

    // Either empty list or an empty-state element
    cy.get('body').then($body => {
      if ($body.find(emptyState).length) {
        cy.get(emptyState).should('be.visible')
      } else {
        cy.get(listItems).should('have.length', 0)
      }
    })
  })

  it('renders the availability visualization with blue, red, and grey lines plus axis ticks', { defaultCommandTimeout: 20000 }, () => {
    cy.visit('/newspapers')

    // Wait up to 10s for the main availability chart <svg> to appear
    cy.get('svg', { timeout: 10000 }).should('be.visible')

    // Blue area/curve line
    cy.get('svg path.area', { timeout: 10000 })
      .should('exist')
      .and($p => {
        const stroke = $p.css('stroke') || $p.css('fill')
        expect(stroke, 'blue availability line').to.match(/blue|rgb\(0,\s*0,\s*255\)|#?0{2}f{2}/i)
      })

    // Red curve
    cy.get('svg path.curve', { timeout: 10000 })
      .should('exist')
      .and($p => {
        const stroke = $p.css('stroke') || $p.css('fill')
        expect(stroke, 'red availability line').to.match(/red|rgb\(255,\s*0,\s*0\)|#?f{2}0{2}0{2}/i)
      })

    // Grey/contrast area
    cy.get('svg path.area.contrast', { timeout: 10000 })
      .should('exist')
      .and($p => {
        const stroke = $p.css('stroke') || $p.css('fill')
        expect(stroke, 'grey availability line').to.match(/grey|gray|rgb\(128,\s*128,\s*128\)|#?808080/i)
      })

    // Axis ticks with year labels
    cy.get('svg .axis.axis--x .tick', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .each($tick => {
        expect($tick.text().trim()).to.match(/^\d{4}$/) // e.g., "1800"
      })
  })

  it('shows correct updated graph values for Pages per year and Issues per year', { defaultCommandTimeout: 20000 }, () => {
    cy.visit('/newspapers')

    const selectDropdownItem = (itemText) => {
      cy.contains('.dropdown-toggle', /pages per year|issues per year/i)
        .click() // open only the correct dropdown
      cy.contains('.dropdown-menu .dropdown-item', itemText).click()
    }

    // Save initial peak value
    cy.get('.d3-timeline .peak text')
      .invoke('text')
      .then((initialValue) => {

        // Pages per year
        selectDropdownItem('pages per year')
        cy.get('.d3-timeline .peak text')
          .should('not.have.text', initialValue)
          .should('contain', '82539')

        // Capture pages value
        cy.get('.d3-timeline .peak text')
          .invoke('text')
          .then((pagesValue) => {

            // Issues per year
            selectDropdownItem('issues per year')
            cy.get('.d3-timeline .peak text')
              .should('not.have.text', pagesValue)
              .should('contain', '8149')
          })
      })
  })

  it('shows correct pages and missing pages in tooltip on hover', () => {
    cy.visit('/newspapers')

    cy.wait(15000)

    cy.get('.d3-timeline')
      .trigger('mouseover')

    cy.get('.tooltip-inner')
      .should('contain.text', 'pages (all newspapers)')
      .and('contain.text', 'missing pages');
  })


  // testing individual newspaper notices


  interface ParsedRow {
    value: number | string;
    name: string;
  }

  interface SortTest {
    label: string;
    parse: (el: Element) => ParsedRow;
    comparator: (a: ParsedRow, b: ParsedRow) => number;
  }

  const tests: SortTest[] = [
    // A–Z
    {
      label: 'order alphabetically, A-Z ↑',
      parse: el => {
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: name, name };
      },
      comparator: (a, b) => (a.value as string).localeCompare(b.value as string),
    },
    // Z–A
    {
      label: 'order alphabetical, Z-A ↓',
      parse: el => {
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: name, name };
      },
      comparator: (a, b) => (b.value as string).localeCompare(a.value as string),
    },
    // First issue ↑
    {
      label: 'order by date of first issue ↑',
      parse: el => {
        const dateText =
          el.querySelector('.small-caps:nth-of-type(2) span.date:first-child')?.textContent?.trim() ||
          '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(dateText), name };
      },
      comparator: (a, b) =>
        (a.value as number) - (b.value as number) ||
        a.name.localeCompare(b.name),
    },
    // First issue ↓
    {
      label: 'order by date of first issue ↓',
      parse: el => {
        const dateText =
          el.querySelector('.small-caps:nth-of-type(2) span.date:first-child')?.textContent?.trim() ||
          '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(dateText), name };
      },
      comparator: (a, b) =>
        (b.value as number) - (a.value as number) ||
        a.name.localeCompare(b.name),
    },
    // Last issue ↑
    {
      label: 'order by date of last issue ↑',
      parse: el => {
        const dateText =
          el.querySelector('.small-caps:nth-of-type(2) span.date:last-child')?.textContent?.trim() ||
          '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(dateText), name };
      },
      comparator: (a, b) =>
        (a.value as number) - (b.value as number) ||
        a.name.localeCompare(b.name),
    },
    // Last issue ↓
    {
      label: 'order by date of last issue ↓',
      parse: el => {
        const dateText =
          el.querySelector('.small-caps:nth-of-type(2) span.date:last-child')?.textContent?.trim() ||
          '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(dateText), name };
      },
      comparator: (a, b) =>
        (b.value as number) - (a.value as number) ||
        a.name.localeCompare(b.name),
    },
    // Issues ↑
    {
      label: 'order by number of available issues ↑',
      parse: el => {
        const issuesText =
          el.querySelector('.small-caps:first-of-type span.number:last-child')?.textContent
            ?.replace(/,/g, '')
            .trim() || '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(issuesText), name };
      },
      comparator: (a, b) =>
        (a.value as number) - (b.value as number) ||
        a.name.localeCompare(b.name),
    },
    // Issues ↓
    {
      label: 'order by number of available issues ↓',
      parse: el => {
        const issuesText =
          el.querySelector('.small-caps:first-of-type span.number:last-child')?.textContent
            ?.replace(/,/g, '')
            .trim() || '0';
        const name = el.querySelector('a strong')?.textContent?.trim() || '';
        return { value: Number(issuesText), name };
      },
      comparator: (a, b) =>
        (b.value as number) - (a.value as number) ||
        a.name.localeCompare(b.name),
    },
  ];

  describe('Newspaper sorting', () => {
    beforeEach(() => {
      cy.visit('/newspapers');
      cy.wait(1000)
    });

    tests.forEach(({ label, parse, comparator }) => {
      it(`sorts correctly for "${label}"`, () => {
        // Open dropdown
        cy.contains('button', 'order by').click();

        // Select sorting option
        cy.contains('.dropdown-item', label).click();

        // Wait for sorting to apply
        cy.wait(500); // replace with cy.intercept() for stability

        // Extract and compare
        cy.get('.newspaper-item').then($els => {
          const rows = $els.toArray().map(parse);
          const sorted = [...rows].sort(comparator);
          expect(rows).to.deep.equal(sorted);
        });
      });
    });
  });



  it('navigates to a newspaper and back to the newspapers list', () => {

    cy.visit('/newspapers');
    cy.wait(1000);
    // Click the first newspaper in the list
    cy.get('.newspaper-item a')
      .first()
      .click();

    // Wait for the metadata page to load (adjust route as needed)
    cy.url().should('include', '/app/newspapers/');

    // Click the "← newspapers" link
    cy.contains('a', '← newspapers').click();

    // Wait for the list page to load again
    cy.wait(1000);

    // Assert that the URL is back to /newspapers
    cy.url().should('eq', `${Cypress.config().baseUrl}/newspapers`);
  });



});
