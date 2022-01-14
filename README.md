
This project is an evluation project as part Toptal screening process

This file will explain about the test automation scripts and how to run 

How to run:
------------
Whether you run locally or in the agents, the command should be npm run cy:run
We can pass the parameter in the command line. Accepted parameters can be found in https://docs.cypress.io/guides/guides/command-line#cypress-run
Please remember to pass the parameter with two sets of -- --
eg: npm run cy:run -- --spec="./integration/01-UI-Test.js"

Compoents of this framework :
-----------------------------
-Test cases for the Juice shop web appliaction can be found in "Harish-Meeran-Mohamed/cypress/integration/01-UI-Test.js"
-Test cases for the API test of "https://wger.de/" application can be found in "Harish-Meeran-Mohamed/cypress/integration/02-API-Test.js"
-Test data is defined in "Harish-Meeran-Mohamed/cypress/fixtures"
-Helpers are nothing bu the reusable modules and can be found in "Harish-Meeran-Mohamed/cypress/helpers"
-html reports can be found in "Harish-Meeran-Mohamed/cypress/reports"
-screenshots can be found in "Harish-Meeran-Mohamed/cypress/screenshots". Screen shot will be taken upon a failure or when we issue a screenshot command
-video recording of the test run can be found in "Harish-Meeran-Mohamed/cypress/videos"

Test script explanation:
------------------------
1. Juice shop web appliaction UI test:
---------------------------------------
    1.a. Smoke Test: This will contain all the important cases:
    -----------------------------------------------------------

        Before starting this test suite: Set the cookies for welcome banner, cookies consent to dismiss so they dont appear in test. Also set the language cookies to english
        -------------------------------- 

        Before starting each test: restore these cookies and also restore the token cookie and toekn local variable so user dont need to login for each test case.
        -------------------------

        After completing each test: save the local storage so it can be restored beforfe the next test
        ---------------------------

        After all the test, remove all the cookies 
        -------------------

        case 1: 
        --------
        New user should be able to register: Click the navigation bar, login menu, registration link in the login form and register the user using email, password, security question and answer. User should be registered successfully. Create a unique email id for registration so we dont get duplicate error upon running the test repatedly. Use timestamp value to generate unique id

        case 2:
        --------
        Login with the registered user credentials. Click the navigation bar, login menu and enter the credntials. User should be logged in successfully and so his email id should be displayed in the navigation bar account menu

        case 3:
        -------
        With the logged in user, try to shop for atleast two products. Set the items per page to maximum value so we dont need to loop through the page and there is a maximum possibility to find two products that are not sold out. Loop through the item until you find two products that are not sold out. Add those two products to the cart, get successful message for adding to the cart and add up the price of each product. Open the cart and see if the total price matches the added up value.

        case 4:
        -------
        checkout the items in basket. Open the cart. Since the user is new, register the address. Enter the addres details, get successful message for registration and choose the registered address. As the user is new, payment card should also be registered and selected after choosing the delivery method. Pay with the card and finalize the payment to complete the order.

        case 5:
        -------
        Check if user cannot buy with fake data. Add new items to the cart. Use the registered address and and choose a delivery method. Register a new card with an invalid card number and expect an error. 

    1.b. Additioanl Test: This will contain additional test cases:
    ---------------------------------------------------------------

        Before starting this test suite: 
        -------------------------------- 
        Set the cookies for welcome banner, cookies consent to dismiss so they dont appear in test. Also set the language cookies to english. Login with the registered user in smoke test
        

        Before starting each test: restore these cookies and also restore the token cookie and toekn local variable so user dont need to login for each test case.
        -------------------------

        After completing each test: save the local storage so it can be restored beforfe the next test
        ---------------------------

        After all the test: Log out the user as there are no more test 
        -------------------

        case 1: 
        -------
        As the user is logged in, he should be able to see the registered card in the profile menu -> orders and payments -> payments option. He should be able to delete this and the card should no longer be saved for payments
        
        As the user is logged in, he should be able to see the registered card in the profile menu -> orders and payments -> saved address. He should be able to delete this and the address should no longer be saved for check out

        case 2:
        -------
        With the logged in user, try to shop for a product that has ribbon "only 1 left". Set the items per page to maximum value so we dont need to loop through the page and there is a maximum possibility to find such product. Loop through the producy until finding once such. Add that the basket and get a successful message. Add it again to the basket and see if an error message is presented

        case 3:
        -------
        check if the logged in user can be abvle to changhe his password by typing the correct old password. Navigate to profile menu in navigation bar, privacy and security menu and change password sub menu. In the change password form, type the old password, new password and confirm the new password. Password should be successfully change and user should be notified. Log out and try to login with the old password and of course expect a failure message. Try to login with the new password and it should be successful 

2. https://wger.de/ appliaction API test:
------------------------------------------
case 1:
-------
Get the work out details by sending a GET request to the end point https://wger.de/api/v2/workout/ with a valid authorization token. Response should be successful with code 200(success).

case 2:
-------
Get the work out details by sending a GET request to the end point https://wger.de/api/v2/workout/ WITHOUT any authorization token. Response should be a failure with code 403(Un authorized).

case 3:
-------
Send a GET request to an invalid end point https://wger.de/api/v2/diet/ with a valid authorization token. Response should be a failure with code 404(Not found).