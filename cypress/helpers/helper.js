import { testUser } from '../fixtures/data'
module.exports = {
    registerAddress: function () {
        cy.get('.btn-new-address').click()
        cy.get('input[type="text"][data-placeholder="Please provide a country."]').type(testUser.address.country)
        cy.get('input[type="text"][data-placeholder="Please provide a name."]').type(testUser.name)
        cy.get('input[type="number"][data-placeholder="Please provide a mobile number."]').type(testUser.mobile)
        cy.get('input[type="text"][data-placeholder="Please provide a ZIP code."]').type(testUser.address.zip)
        cy.get('#address').type(testUser.address.street)
        cy.get('#submitButton').should('not.be.enabled')
        cy.get('input[type="text"][data-placeholder="Please provide a city."]').type(testUser.address.city)
        cy.get('#submitButton').should('be.enabled')
        cy.get('input[type="text"][data-placeholder="Please provide a state."]').type(testUser.address.state)
        cy.get('#submitButton').click()
        cy.get('.mat-simple-snackbar').should('contain.text', 'The address at ' + testUser.address.city + ' has been successfully added to your addresses.')
    },
    registerCard: function (cardNumber, expiryMonth, expiryDate) {
        cy.get('[type=text]').eq(1).type(testUser.name, { force: true })
        cy.get('[type=number]').eq(0).type(cardNumber, { force: true })
        cy.get('select').first().select(expiryMonth)
        cy.get('select').eq(1).select(expiryDate)
    },
    login: function (email, password) {
        cy.get('#navbarAccount').click({ force: true })
        cy.get('#navbarLoginButton').click({ force: true })
        cy.get('#login-form').should('exist')
        cy.get('input#email').clear().type(email)
        cy.get('#password').clear().type(password)
        cy.get('#loginButton').should('be.enabled')
        cy.get('#loginButton').click()
        cy.wait(2000)
        cy.get('#navbarAccount').click({ force: true })
        cy.get('button[aria-label="Go to user profile"]').should('contain.text', email)
        cy.get('#navbarAccount').click({ force: true })
    },

    logout: function () {
        cy.get('#navbarAccount').click({ force: true })
        cy.get('button').contains('Logout').click()
        //make sure user has logged out
        cy.get('button[aria-label="Show the shopping cart"]').should('not.exist')
    },

    shop: function () {
        //make sure user is logged in
        cy.get('button[aria-label="Show the shopping cart"]').should('exist')
        //set the pagination break point to max so there is high possibility to find a non sold out items
        cy.get('.mat-select-arrow-wrapper').click({ force: true })
        cy.get('[aria-label="Items per page:"]').children().last().click({ force: true })
        cy.get('.mat-paginator-range-label').invoke('text').then((text) => {
            let totalPrice = 0
            let splitText = text.split(" ")
            let shownItems = parseInt(splitText[3])
            let addedItems = 0
            //Loop through all the shown items and add the first item which is not sold out
            for (let loop = 0; loop < shownItems; loop++) {
                cy.get('.mat-card').eq(loop).then((el) => {
                    //shop two items and add each price to total price
                    if (addedItems >= 2) {
                        loop = shownItems
                    }
                    else {
                        if (el.find('.ribbon-top-left').length > 0 && el.find('.ribbon-top-left').text() === 'Sold Out') {
                            cy.log('item no: ' + loop + 1 + 'is sold out')
                        }
                        else {
                            cy.get('[aria-label="Add to Basket"]button').eq(loop).click({ force: true })
                            cy.get('.item-name').eq(loop).invoke('text').then((item) => {
                                cy.get('.mat-simple-snackbar').should('contain.text','Placed' + item + 'into basket')
                            })
                            cy.get('.item-price').eq(loop).invoke('text').then((price) => {
                                totalPrice = totalPrice + parseFloat(price.slice(0, -1))
                            })
                            addedItems++
                        }
                    }
                })
            }
            //check the number on the cart icon
            cy.get('button[aria-label="Show the shopping cart"] .fa-layers-counter').should('have.text', 2)
            // verify the total price
            cy.get('button[aria-label="Show the shopping cart"]').click({ force: true })
            cy.get('#price').should('contain.text', 'Total Price: ' + totalPrice)
        })

    }
}
