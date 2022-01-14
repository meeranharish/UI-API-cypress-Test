/// <reference types="cypress" />
describe('wger REST API test', () => {
    it('Get the work Out details - Test for 200 status code', () => {
        cy.request(
            {
                'method': 'GET',
                'url': 'https://wger.de/api/v2/workout/',
                'headers': {
                    'Authorization': 'Token 4cd9c9f78e1701fc94b8745f68d0e9807b09605a'
                  }
            }).then((response) => {
                expect(response.status).to.equal(200)
            })
    })
    it('Get the work Out details witout auth header - Test for 403 status code', () => {
        cy.request(
            {
                'method': 'GET',
                'url': 'https://wger.de/api/v2/workout/',
                'failOnStatusCode': false
            }).then((response) => {
                expect(response.status).to.equal(403)
            })
    })
    it('Hit an invalid end point - Test for 404 status code', () => {
        cy.request(
            {
                'method': 'GET',
                'url': 'https://wger.de/api/v2/diet/',
                'failOnStatusCode': false,
                'headers': {
                    'Authorization': 'Token 4cd9c9f78e1701fc94b8745f68d0e9807b09605a'
                  }
            }).then((response) => {
                expect(response.status).to.equal(404)
            })
    })
})
