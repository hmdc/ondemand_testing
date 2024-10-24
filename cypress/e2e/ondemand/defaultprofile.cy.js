import {NAVIGATION, loadHomepage, navigateFiles} from "../../support/utils/navigation.js";

describe('Dashboard - Default Profile', () => {
  const defaultProfile = Cypress.env('default_profile')
  Cypress.config('baseUrl', NAVIGATION.baseUrl);

  before(() => {
    loadHomepage()

    const rootPath = Cypress.env('dashboard_rootPath')
    const auth = cy.sid.auth
    // GET THE CSRF TOKEN TO SUBMIT THE OOD SETTINGS FILE DELETE REQUEST
    cy.get('meta[name="csrf-token"]').invoke('attr', 'content').then(csrfToken => {
      navigateFiles()
      // THERE ARE JS ERRORS IN THE ACTIVE JOBS PAGE
      Cypress.on('uncaught:exception', () => false)
      // GET THE USER HOMEPAGE PATH
      cy.get('button#copy-path').invoke('attr', 'data-clipboard-text').then(homeDirectory => {

        const settingsFile = `${homeDirectory}/.config/ondemand/settings.yml`
        cy.task('log', `Deleting settings file: ${settingsFile}`)
        // POST REQUEST FROM THE FILES APP TO DELETE THE SETTINGS FILE
        cy.request({
          method: 'POST',
          url: `${rootPath}/transfers.json`,
          auth: auth,
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: {
            command: 'rm',
            files: [settingsFile],
            from_fs:	'fs'
          },
          failOnStatusCode: true
        }).then((response) => {
          expect(response.status).to.eq(200);
        });

      })
    })

  })

  beforeEach(() => {
    //DEFAULT SIZE FOR THESE TESTS
    cy.viewport(cy.sid.screen.largeWidth, cy.sid.screen.height)
  })

  it('Should display default profile', () => {
    loadHomepage()
    cy.get('meta[name="profile"]').should('have.attr', 'content', defaultProfile);
  })

})