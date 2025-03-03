interface TestUrl {
  url: string
  testTitle: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  payload?: Record<string, any>
}
const testUrls: TestUrl[] = [
  {
    url: "https://impresso-project.ch/app/compare?left=CgkIARgJKgNFWFAKCAgBGAwqAmZyChwIARgSKhZ0bS1mci1hbGwtdjIuMF90cDU4X2ZyCggIARgWKgJDSAoICAEYDSoCYXIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTJfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMzZfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDBfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMjVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMThfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNjRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwOTdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDNfZnI=&right=CgkIARgJKgNFWFAKCAgBGAwqAmZyChwIARgSKhZ0bS1mci1hbGwtdjIuMF90cDU4X2ZyCggIARgWKgJDSAoICAEYDSoCYXIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTJfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMzZfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDBfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNTVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNDRfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMjVfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMThfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwNzhfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwMDdfZnIKHAgBGBIqFnRtLWZyLWFsbC12Mi4wX3RwODVfZnI=",
    testTitle: "two long query parameters"
  },
  {
    url: "https://dev.impresso-project.ch/public-api/v1/authentication",
    testTitle: "authentication endpoint - accessToken word (RITM0183100)",
    method: 'POST',
    payload: {
      "strategy": "jwt-app",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiJsb2NhbC1kZyIsInVzZXJHcm91cHMiOlsiTkRBIiwicGxhbi1yZXNlYXJjaGVyIl0sImlzU3RhZmYiOnRydWUsImlhdCI6MTcyMzgwMTc1MiwiZXhwIjoxNzI0NDA2NTUyLCJhdWQiOiJodHRwczovL2Rldi5pbXByZXNzby1wcm9qZWN0LmNoL2FwcCIsImlzcyI6ImltcHJlc3NvLXYxIiwic3ViIjoiMSIsImp0aSI6ImVkZDRhZDcxLTUyYjYtNDY2My04Mjk1LTgwOTkwMGY4ZTUyZiJ9.oswrQskk7S6kwHyLjag1Qnr48zM5yXzUwEWJKv8MSM8"
    }
  },
  {
    testTitle: "Something wrong with spaces between words in the payload text (RITM0197775)",
    url: "https://dev.impresso-project.ch/public-api/v1/tools/ner",
    method: 'POST',
    payload: {
      "text": "The Universal Declaration of Human Rights (UDHR) is a milestone document...",
      "method": "ner"
    }
  },
  // only available from whitelisted IPs
  // {
  //   testTitle: "Access admin (RITM0213930)",
  //   url: "https://dev.impresso-project.ch/admin/"
  // },
  {
    url: "https://dev.impresso-project.ch/app/search?sq=ChkQAhgTKhNsb2NhbC1kdW1hLVNFX0o1RzBlCggQAhgNKgJhZAoyEAIYCiosMTk2OC0wMS0wMVQwMDowMDowMFogVE8gMTk5MC0xMi0zMVQyMzo1OTo1OVoKrgEIARACGBIqFnRtLWZyLWFsbC12Mi4wX3RwMTdfZnIqFnRtLWZyLWFsbC12Mi4wX3RwOTJfZnIqFnRtLWZyLWFsbC12Mi4wX3RwODdfZnIqFnRtLWZyLWFsbC12Mi4wX3RwMzlfZnIqFnRtLWZyLWFsbC12Mi4wX3RwODhfZnIqFnRtLWZyLWFsbC12Mi4wX3RwMTZfZnIqFnRtLWZyLWFsbC12Mi4wX3RwNDZfZnIKAhgC&orderBy=date&p=13",
    testTitle: "search page with query parameters (RITM0219788)"
  },
  {
    testTitle: "long query parameters (RITM0220138)",
    url: "https://dev.impresso-project.ch/app/search?sq=ChkQAhgTKhNsb2NhbC1kdW1hLVNFX0o1RzBlCggQAhgNKgJhZAoyEAIYCiosMTk2OC0wMS0wMVQwMDowMDowMFogVE8gMTk5MC0xMi0zMVQyMzo1OTo1OVoKrgEIARACGBIqFnRtLWZyLWFsbC12Mi4wX3RwMTdfZnIqFnRtLWZyLWFsbC12Mi4wX3RwOTJfZnIqFnRtLWZyLWFsbC12Mi4wX3RwODdfZnIqFnRtLWZyLWFsbC12Mi4wX3RwMzlfZnIqFnRtLWZyLWFsbC12Mi4wX3RwODhfZnIqFnRtLWZyLWFsbC12Mi4wX3RwMTZfZnIqFnRtLWZyLWFsbC12Mi4wX3RwNDZfZnIKAhgC&orderBy=date&p=13"
  },
  {
    testTitle: "long query parameters (RITM0221835)",
    url: "https://dev.impresso-project.ch/app/compare?left=CgIYAgoZEAIYEyoTbG9jYWwtZHVtYS1TRV9KNUcwZQoIEAIYDSoCYWQKMhACGAoqLDE5NzAtMDEtMDFUMDA6MDA6MDBaIFRPIDIwMTctMTItMzFUMjM6NTk6NTlaCh4IARACGBIqFnRtLWZyLWFsbC12Mi4wX3RwMTdfZnIKJQgBGBEqH2FpZGEtMDAwMS01NC1TdWlzc2UkMmMkX01vc2VsbGU=&right=ChkQAhgTKhNsb2NhbC1kdW1hLVNFX0o1RzBlCggQAhgNKgJhZAoyEAIYCiosMTk3MC0wMS0wMVQwMDowMDowMFogVE8gMjAxNy0xMi0zMVQyMzo1OTo1OVoKGhgSKhZ0bS1mci1hbGwtdjIuMF90cDQ2X2ZyChsIARgRKhVhaWRhLTAwMDEtNTQtTGF1c2FubmU="
  },
  {
    testTitle: "long query parameters (RITM0221829)",
    url: "https://dev.impresso-project.ch/app/compare?left=CgIYAgoZEAIYEyoTbG9jYWwtZHVtYS1TRV9KNUcwZQoIEAIYDSoCYWQKMhACGAoqLDE5NzAtMDEtMDFUMDA6MDA6MDBaIFRPIDIwMTctMTItMzFUMjM6NTk6NTlaCh4IARACGBIqFnRtLWZyLWFsbC12Mi4wX3RwMTdfZnI=&right=ChkQAhgTKhNsb2NhbC1kdW1hLVNFX0o1RzBlCggQAhgNKgJhZAoyEAIYCiosMTk3MC0wMS0wMVQwMDowMDowMFogVE8gMjAxNy0xMi0zMVQyMzo1OTo1OVoKGhgSKhZ0bS1mci1hbGwtdjIuMF90cDQ2X2Zy",
  },
  {
    testTitle: "long query parameters (RITM0221836)",
    url: "https://dev.impresso-project.ch/app/compare?left=CgIYAgoZEAIYEyoTbG9jYWwtZHVtYS1TRV9KNUcwZQoIEAIYDSoCYWQKMhACGAoqLDE5NzAtMDEtMDFUMDA6MDA6MDBaIFRPIDIwMTctMTItMzFUMjM6NTk6NTlaCh4IARACGBIqFnRtLWZyLWFsbC12Mi4wX3RwMTdfZnIKJQgBGBEqH2FpZGEtMDAwMS01NC1TdWlzc2UkMmMkX01vc2VsbGUKIggBGBAqHGFpZGEtMDAwMS01MC1ULl9FLl9CLl9DbGFya2UKIwgBGBEqHWFpZGEtMDAwMS01NC1HYXJlX2RlX0Nvcm5hdmluChgIARgRKhJhaWRhLTAwMDEtNTQtQmFzZWwKFggBGBEqEGFpZGEtMDAwMS01NC1VU0E=&right=ChkQAhgTKhNsb2NhbC1kdW1hLVNFX0o1RzBlCggQAhgNKgJhZAoyEAIYCiosMTk3MC0wMS0wMVQwMDowMDowMFogVE8gMjAxNy0xMi0zMVQyMzo1OTo1OVoKGhgSKhZ0bS1mci1hbGwtdjIuMF90cDQ2X2ZyChsIARgRKhVhaWRhLTAwMDEtNTQtTGF1c2FubmUKHggBGBAqGGFpZGEtMDAwMS01MC1BbGFpbl9CYXVlcgogCAEYESoaYWlkYS0wMDAxLTU0LUFpZ2xlX05vaXJfQUMKMwgBGBAqLWFpZGEtMDAwMS01MC1DbGF1ZGVfRHVib2lzXyQyOCRwb2xpdGljaWFuJDI5JAonCAEYECohYWlkYS0wMDAxLTUwLUVkd2FyZF9BLl9CdXJraGFsdGVy"
  }
  // It's ok to block this one
  // {
  //   url: "https://dev.impresso-project.ch/public-api/v1/search/sadf",
  //   testTitle: "wrong method, expecting 405"
  // },
] satisfies TestUrl[]

describe('Uni.lu firewall', () => {
  testUrls.filter(i => i.method === 'GET' || i.method == null).forEach(({ testTitle, url }) => {
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

  testUrls.filter(i => i.method != null && i.method != 'GET').forEach(({ testTitle, url, payload, method }) => {
    it(`${method}: ${testTitle}`, () => {
      cy.intercept(method, url, payload).as('pageRequest')
      return cy.request({
        method: method,
        url: url,
        body: payload,
        failOnStatusCode: false
      }).then(response => {
        const hasTraceOfFirewallText = (typeof response.body === 'string') 
          && response.body.includes('<title>Request Rejected</title>') 
          && response.body.includes('https://service.uni.lu')
        if (response.status === 403 && hasTraceOfFirewallText) {
          throw new Error('Blocked by firewall')
        }
      })
    });
  })
})