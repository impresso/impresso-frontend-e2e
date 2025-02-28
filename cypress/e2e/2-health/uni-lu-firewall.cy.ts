interface TestUrl {
  url: string
  testTitle: string
}
const testUrls = [
  {
    url: "https://impresso-project.ch/app/compare?left=CgkIARgJKgNFWFAKCAgBGAwqAmZyChwIARgSKhZ0bS1mci1hbGwtdjIuMF90cDU4X2ZyCggIARgWKgJDSAoICAEYDSoCYXIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTJfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMzZfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDBfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMjVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMThfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNjRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwOTdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDNfZnI=&right=CgkIARgJKgNFWFAKCAgBGAwqAmZyChwIARgSKhZ0bS1mci1hbGwtdjIuMF90cDU4X2ZyCggIARgWKgJDSAoICAEYDSoCYXIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTJfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMzZfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDBfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMjVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMThfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNzhfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwODVfZnI=",
    testTitle: "two long query parameters"
  },
  // It's ok to block this one
  // {
  //   url: "https://dev.impresso-project.ch/public-api/v1/search/sadf",
  //   testTitle: "wrong method, expecting 405"
  // },
] satisfies TestUrl[]

describe('Uni.lu firewall', () => {
  testUrls.forEach(({ testTitle, url }) => {
    it(`${testTitle}`, () => {
      cy.intercept('GET', url).as('pageRequest')
      cy.visit(url, { failOnStatusCode: false })
      
      return Promise.all([
        cy.wait('@pageRequest').its('response.statusCode'),
        cy.title(),
      ]).then(([statusCode, title]) => {
        const isBlockedByFirewall = statusCode === 403 && title === 'Request Rejected'
        if (isBlockedByFirewall) {
          throw new Error('Blocked by firewall')
        }
      })
    });
  });
})