describe('Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/register')
    })


    it('should show an error message for invalid registration', () => {
        cy.get('#username').type('testuser')
        cy.get('#email').type('test@example.com')
        cy.get('#password1').type('password')
        cy.get('#password2').type('password')
        cy.get('button[type="submit"]').click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Failed to register. Check your username, email and password.')
        })
    })
})