it('dummy test for now', () => {

});

// it('signup and login user', () => {
//   cy.visit('http://localhost:8080')
//   cy.get('#enter-app-button').click()
//   cy.get('#signup-link').click()

//   cy.get('input[name="username"]').type('rimaa')
//   cy.get('input[name="password1"]').type('1234')
//   cy.get('input[name="password2"]').type('1234')
//   cy.get('input[name="firstName"]').type('rima')
//   cy.get('input[name="lastName"]').type('amri')
//   cy.get('input[name="email"]').type('rimaa@cypress.io')
//   cy.get('#signup-button').click()

//   cy.location('pathname').should('eq', '/login')

//   cy.get('input[name="emailForm"]').type('rima@cypress.io')
//   cy.get('input[name="passwordForm"]').type('1234')
//   cy.get('#login-button').click()

//   cy.location('pathname').should('eq', '/campgroundsHome')
// })