describe('PatientPage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
        cy.get('#email').type('test@example.com')
        cy.get('#password').type('password')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/doctors')
        cy.visit('http://localhost:5173/doctors')
        cy.get('#profile-icon-5').first().click()
        cy.url().should('include', '/patients/5')
    })

    it('should display patient list', () => {
        cy.get('#samples').should('be.visible')
    })


    it('should go to result page when knn button is clicked', () => {
        cy.get('#blood-icon-781').click()
        cy.url().should('include', '/result')
    })

    it('should add sample when add button is clicked', () => {
        cy.get('#add-new-sample').should('exist').click();


        cy.get('#organ-type').should('exist').click();
        cy.get('li[data-value="pancreas"]').should('be.visible').click();

        cy.get('#plasma_CA19_9', { timeout: 10000 }).should('be.visible').clear().type('1');
        cy.get('#creatinine', { timeout: 10000 }).should('be.visible').clear().type('1');
        cy.get('#LYVE1', { timeout: 10000 }).should('be.visible').clear().type('1');
        cy.get('#REG1B', { timeout: 10000 }).should('be.visible').clear().type('1');
        cy.get('#TFF1', { timeout: 10000 }).should('be.visible').clear().type('1');
        cy.get('#REG1A', { timeout: 10000 }).should('be.visible').clear().type('1');

        cy.get('#add-sample-button').should('exist').click();
        cy.get('#sample-dialog').should('not.exist');
    });




})