import { NAVIGATION, loadHomepage, navigateToApplication } from "../../../support/utils/navigation.js";
import { changeProfile } from "../../../support/utils/profiles.js";
import {cleanupSessions, checkSession, startAppSession} from "../../../support/utils/sessions.js";

describe('Sid Dashboard - Interactive Apps', () => {
  const interactiveApps = cy.sid.ondemandApplications.filter(l => Cypress.env('sid_dashboard_applications').includes(l.id))
  const launchApplications = Cypress.env('launch_applications')
  Cypress.config('baseUrl', NAVIGATION.baseUrl);

  before(() => {
    loadHomepage()
    changeProfile(cy.sid.profiles.sid.title)
  })

  beforeEach(() => {
    //DEFAULT SIZE FOR THESE TESTS
    cy.viewport(cy.sid.screen.largeWidth, cy.sid.screen.height)
    loadHomepage()
  })

  it('Should display restricted interactive apps left menu', () => {
    cy.wrap(interactiveApps).each( app => {
      cy.task('log', `Checking interactive app menu: ${app.token}`)
      navigateToApplication(app.name)
      cy.get('div.system-and-shared-apps-header div.card-header').should($heading => {
        expect($heading.text()).to.match(/interactive apps/i)
      })

      interactiveApps.forEach( app => {
        cy.get('div.list-group a').filter(`a[data-title="${app.name}"]`).should($appElement => {
          $appElement.is(':visible')
          expect($appElement.text().trim()).to.equal(app.name)
          expect($appElement.attr('href')).to.contain(app.token)
        })
      })
    })
  })

  !launchApplications && it(`Should launch interactive application - DISABLED`, () => {})

  launchApplications && interactiveApps.forEach( app => {
    it(`Should launch interactive application: ${app.token}`, () => {
      cleanupSessions()

      //LAUNCH APP
      startAppSession(app)
      //CHECK LAUNCHED APP IN SESSIONS PAGE IS RUNNING
      checkSession(app, true)
      //CLEANUP
      cleanupSessions()
    })
  })

})