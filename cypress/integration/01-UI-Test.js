/// <reference types="cypress" />

import { testUser } from './../fixtures/data'
import { registerCard, registerAddress, login, logout, shop } from "../helpers/helper"
import "cypress-localstorage-commands"
let loginEmail

describe('Juice Shop App - Smoke Test', () => {

    before(() => {
        //Cookies set to dimiss welcome message, cache and language warining
        cy.setCookie('welcomebanner_status', 'dismiss')
        cy.setCookie('cookieconsent_status', 'dismiss')
        cy.setCookie('language', 'en')
        cy.visit('/')

    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('token', 'welcomebanner_status', 'cookieconsent_status', 'language', 'continueCode')
        cy.restoreLocalStorage() //restore local storage so each test dont need to repeat the login floe
        cy.visit('/')
    });

    afterEach(() => {
        cy.saveLocalStorage() //saving local storage to restore in the next test
    });

    after(() => {
        cy.clearCookies('/')
    })

    it('Register a new user', () => {
        cy.get('#navbarAccount').click()
        cy.get('#navbarLoginButton').click()
        cy.get('#login-form').should('exist')
        cy.get('#newCustomerLink').click()
        cy.get('#registration-form').should('exist')
        loginEmail = testUser.email + new Date().valueOf()
        cy.get('#emailControl[type="text"]').type(loginEmail)
        cy.screenshot('find-email-id')
        cy.log(loginEmail)
        cy.get('#passwordControl[type="password"]').type(testUser.password)
        cy.get('#repeatPasswordControl[type="password"]').type(testUser.password)
        cy.get('[name="securityQuestion"]').click()
        cy.get('.mat-option-text').contains(testUser.securityQuestion).click()
        cy.get('#securityAnswerControl').type(testUser.securityAnswer)
        cy.get('#registerButton').click()
        cy.get('.mat-simple-snackbar').should('contain.text', 'Registration completed successfully. You can now log in.')
    })
    it('login with registered user', () => {
        login(loginEmail, testUser.password)
    })

    it('Logged in User adds any two available product to the basket', () => {
        shop()
    })

    it('Logged in User checks out the items from basket', () => {
        cy.get('button[aria-label="Show the shopping cart"]').click({ force: true })
        cy.get('#checkoutButton').click()
        // create a new address
        cy.intercept('POST', '**api/Addresss/').as('createAddress')
        registerAddress()
        cy.wait('@createAddress')
        // select address
        cy.contains(testUser.address.street + ', ' + testUser.address.city + ', ' + testUser.address.state + ', ' + testUser.address.zip).click({ force: true })
        cy.get('button').contains('Continue').click()
        //select delivery option
        cy.contains('Standard Delivery').click({ force: true })
        cy.get('button').contains('Continue').click()
        //select payment option
        cy.get('.mat-expansion-panel-header-title').contains(' Add new card ').click({ force: true })
        // add credit card details
        registerCard(testUser.card.number, testUser.card.expiryMonth, testUser.card.expiryYear)
        cy.get('#submitButton').click()
        cy.get('.mat-simple-snackbar').should('contain.text', 'Your card ending with ' + testUser.card.number.substring(12, 16) + ' has been saved for your convenience.')
        // select card
        cy.contains('************' + testUser.card.number.substring(12, 16)).parent().find('mat-radio-button').within(() => {
            cy.get('[type="radio"]').check({ force: true })
            cy.get('.mat-radio-outer-circle').click({ force: true }) //This is anti pattern but did so to verify the next page. 
        })
        cy.get('.mat-radio-checked').should('exist')
        cy.get('[aria-label="Proceed to review"]').should('be.enabled')
        cy.get('button[aria-label="Proceed to review"]').click({ force: true })
        //finalize order
        cy.get('#checkoutButton').click()
        cy.get('h1.confirmation').should('have.text', 'Thank you for your purchase!')
    })
    it('Logged in User purchase with fake data(card)', () => {
        shop()
        cy.get('button[aria-label="Show the shopping cart"]').click({ force: true })
        cy.get('#checkoutButton').click()
        // select address
        cy.contains(testUser.address.street + ', ' + testUser.address.city + ', ' + testUser.address.state + ', ' + testUser.address.zip).click({ force: true })
        cy.get('button').contains('Continue').click()
        //select delivery option
        cy.contains('Standard Delivery').click({ force: true })
        cy.get('button').contains('Continue').click()
        //select payment option
        cy.get('.mat-expansion-panel-header-title').contains(' Add new card ').click({ force: true })
        // add credit card details
        registerCard(testUser.fakeCard.number, testUser.fakeCard.expiryMonth, testUser.fakeCard.expiryYear)
        cy.get('.mat-error').should('contain.text', 'Please enter a valid sixteen digit card number.')
    })
})
describe('Juice Shop App - Additional Test', () => {
    before(() => {
        //Cookies set to dimiss welcome message, cache and language warining
        cy.setCookie('welcomebanner_status', 'dismiss')
        cy.setCookie('cookieconsent_status', 'dismiss')
        cy.setCookie('language', 'en')
        cy.visit('/')
        login(loginEmail, testUser.password)
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('token', 'welcomebanner_status', 'cookieconsent_status', 'language', 'continueCode')
        cy.restoreLocalStorage(); //restore local storage so each test dont need to repeat the login floe
        cy.visit('/')
    });

    afterEach(() => {
        cy.saveLocalStorage() //saving local storage to restore in the next test
    });

    after(() => {
        logout()
    })

    it('Delete existing card details and address', () => {
        cy.get('#navbarAccount').click({ force: true })
        cy.get('button').contains('Orders & Payment').click()
        cy.get('button').contains('My Payment Options').click()
        cy.get('[data-icon="trash-alt"]').click()
        cy.contains('************' + testUser.card.number.substring(12, 16)).should('not.exist')
        cy.get('#navbarAccount').click({ force: true })
        cy.get('button').contains('Orders & Payment').click()
        cy.get('button').contains('My saved addresses').click()
        cy.get('[data-icon="trash-alt"]').click()
        cy.contains(testUser.address.street + ', ' + testUser.address.city + ', ' + testUser.address.state + ', ' + testUser.address.zip).should('not.exist')
    })
    it('check out the last available item and verify for no stock available message', () => {
        //set the pagination break point to max so there is high possibility to find an items that has only one left
        cy.get('.mat-select-arrow-wrapper').click({ force: true })
        cy.get('[aria-label="Items per page:"]').children().last().click({ force: true })
        cy.get('.mat-paginator-range-label').invoke('text').then((text) => {
            let splitText = text.split(" ")
            let shownItems = parseInt(splitText[3])
            let itemAdded = false
            //Loop through all the shown items and add the first item which is not sold out
            for (let loop = 0; loop < shownItems; loop++) {
                cy.get('.mat-card').eq(loop).then((el) => {
                    if (itemAdded) {
                        loop = shownItems
                    }
                    else {
                        if (el.find('.ribbon-top-left').length > 0 && el.find('.ribbon-top-left').text() === 'Only 1 left') {
                            cy.get('[aria-label="Add to Basket"]button').eq(loop).click({ force: true })
                            cy.get('.item-name').eq(loop).invoke('text').then((item) => {
                                cy.get('.mat-simple-snackbar').should('contain.text','Placed' + item + 'into basket')
                            })
                            itemAdded = true
                            cy.wrap(loop).as('soldOutItem')
                        }
                    }
                })
            }
            //check for not in stock message
            cy.get('@soldOutItem').then((soldOutItem) => {
                cy.get('[aria-label="Add to Basket"]button').eq(soldOutItem).click({ force: true })
                cy.get('.mat-simple-snackbar').should('contain.text', 'We are out of stock! Sorry for the inconvenience.')
            })
        })
    })
    it('Change user password', () => {
        let newPassword = 'Abcde1'
        cy.get('#navbarAccount').click({ force: true })
        cy.get('button').contains(' Privacy & Security ').click()
        cy.get('button').contains('Change Password').click()
        cy.get('#currentPassword').type(testUser.password)
        cy.get('#newPassword').type('Abcde1')
        cy.get('#newPasswordRepeat').type(newPassword)
        cy.get('#changeButton').click()
        cy.get('.confirmation').should('have.text', ' Your password was successfully changed. ')
        //User should be able to login only with new password
        logout()
        cy.get('#navbarAccount').click({ force: true })
        cy.get('#navbarLoginButton').click({ force: true })
        cy.get('input#email').clear().type(loginEmail)
        cy.get('#password').clear().type(testUser.password)
        cy.get('#loginButton').click()
        cy.get('.error').should('have.text','Invalid email or password.')
        login(loginEmail, newPassword)
    })
})