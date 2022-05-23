describe('Input Add Location and Date', () => {
    it('Page Exist', () => {
        cy.visit("http://localhost:3000/")
    })

    it('Check for Location and Date input ', () => {
        const startDate = new Date()
        cy.get('[data-cy=location]').invoke('attr', 'placeholder').should('contain', 'Location')
        cy.get('.react-datepicker__input-container').invoke('attr', 'placeholder').should('contain', startDate)
        cy.get('.react-datepicker__input-container').invoke('attr', 'placeholder').should('contain', new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    })  

    it('should type in new date', () => {
        cy.get('[data-cy=location]').type('Toronto')
        cy.get('#startDate').invoke('attr', 'value', '04/08/2022')
        cy.get('#startDate').invoke('attr', 'value', '04/10/2022')
    })
    
})

