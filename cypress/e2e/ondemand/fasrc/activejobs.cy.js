import { NAVIGATION, loadHomepage, navigateActiveJobs, visitApplication } from "../../../support/utils/navigation.js";
import { cleanupSessions, checkSession, startAppSession } from "../../../support/utils/sessions.js";
import {changeProfile} from "../../../support/utils/profiles";

describe('FASRC Dashboard - Active Jobs', () => {
  const demoApp = cy.sid.ondemandApplications.filter(l => l.id == Cypress.env('fasrcv3_interactive_sessions_app')).shift()
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

  it(`${fasrcClusterProfile}: Should display active jobs page`, () => {
    cleanupSessions()
    //LAUNCH APP WITH EMPTY PARAMETERS
    startAppSession(demoApp)
    checkSession(demoApp, false)
    navigateActiveJobs()
    // THERE ARE JS ERRORS IN THE ACTIVE JOBS PAGE
    Cypress.on('uncaught:exception', () => false)
    cy.wait(2000)

    cy.get('div.row h2').invoke('text').should('match', new RegExp('active jobs', "i"))
    // ORDER BY JOB ID DESCENDENT
    // NEED TO CLICK TWICE. FIRST ASCENDANT, SECOND DESCENDANT
    cy.get('div.row table#job_status_table thead th.sorting').first().click()
    cy.wait(2000)
    cy.get('div.row table#job_status_table thead th.sorting').first().click()
    cy.wait(2000)

    cy.get('div.row table#job_status_table tbody tr').then($jobs => {
      expect($jobs).to.have.length.greaterThan(0)
      const $jobFields = $jobs.first().find("td")
      expect($jobFields).to.have.length(10)
      expect($jobFields.eq(2).text()).to.match(new RegExp(demoApp.token, 'i'))
      expect($jobFields.eq(7).text()).to.match(/running/i)
    })

    cleanupSessions()
  })

})