import { NAVIGATION, loadHomepage, navigateSessions } from "../../../support/utils/navigation.js";
import { changeProfile } from "../../../support/utils/profiles.js";
import { cleanupSessions, checkSession, startAppSession } from "../../../support/utils/sessions.js";

describe('FASRC Dashboard - Interactive Sessions', () => {
  const demoApp = cy.sid.ondemandApplications.filter(l => l.id == Cypress.env('fasrcv3_interactive_sessions_app')).shift()
  const interactiveApps = cy.sid.ondemandApplications.filter(l => Cypress.env('fasrcv3_dashboard_applications').includes(l.id))
  const fasrcClusterProfile = Cypress.env('fasrc_cluster_profile')
  Cypress.config('baseUrl', NAVIGATION.baseUrl);

  before(() => {
    loadHomepage()
    changeProfile(fasrcClusterProfile)
  })

  beforeEach(() => {
    //DEFAULT SIZE FOR THESE TESTS
    cy.viewport(cy.sid.screen.largeWidth, cy.sid.screen.height)
    loadHomepage()
  })

  it(`${fasrcClusterProfile}: Should display restricted interactive apps left menu`, () => {
    navigateSessions()
    interactiveApps.forEach( app => {
      cy.get('div.list-group a').filter(`a[data-title="${app.name}"]`).should($appElement => {
        $appElement.is(':visible')
        expect($appElement.text().trim()).to.equal(app.name)
        expect($appElement.attr('href')).to.contain(app.token)
      })
    })
  })

  it(`${fasrcClusterProfile}: Should display session panel fields`, () => {
    cleanupSessions()

    //LAUNCH APP
    startAppSession(demoApp)
    //CHECK LAUNCHED APP IN SESSIONS PAGE IS RUNNING
    checkSession(demoApp, true)
    //CLEANUP
    cleanupSessions()
  })

})