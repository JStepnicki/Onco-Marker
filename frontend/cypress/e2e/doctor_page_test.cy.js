describe('DoctorPage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
        cy.get('#email').type('test@example.com')
        cy.get('#password').type('password')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/doctors')
    })

    it('should update dialog when update button is clicked', () => {
        cy.visit('http://localhost:5173/doctors')
        cy.get('#edit-icon-6').first().click()
        cy.get('#name').type('Updated Name')
        cy.get('#surname').type('Updated Surname')
        cy.get('#email').type('Updated Email')
        cy.get('#age').type('Updated Age')
        cy.get('#update-button').click()
        cy.get('#edit-dialog').should('not.exist')
    })

    it('should redirect to login if not authenticated', () => {
        cy.window().then((win) => {
            win.sessionStorage.clear()
        })
        cy.visit('http://localhost:5173/doctors')
        cy.url().should('include', '/')
    })

    it('should display patient list', () => {
        cy.visit('http://localhost:5173/doctors')
        cy.get('#patient-list').should('be.visible')
    })

    it('should open edit dialog when edit icon is clicked', () => {
        cy.visit('http://localhost:5173/doctors')
        cy.get('#edit-icon-5').first().click()
        cy.get('#edit-dialog').should('be.visible')
    })

    it('should open edit dialog when edit icon is clicked', () => {
        cy.visit('http://localhost:5173/doctors')
        cy.get('#profile-icon-5').first().click()
        cy.url().should('include', '/patients/5')
    })

    it('should close edit dialog when cancel button is clicked', () => {
        cy.visit('http://localhost:5173/doctors')
        cy.get('#edit-icon-5').first().click()
        cy.get('#cancel-button').click()
        cy.get('#edit-dialog').should('not.exist')
    })


})