describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('should log in', () => {
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/doctors')
  })

  it('should show an error message for invalid credentials', () => {
    cy.get('#email').type('invalid@example.com')
    cy.get('#password').type('invalidpassword')
    cy.get('button[type="submit"]').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid email or password')
    })
  })
})