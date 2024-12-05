import { NAVIGATION, loadHomepage, navigateToMetrics } from "../../../support/utils/navigation.js";
import {changeProfile} from "../../../support/utils/profiles";

describe('FASRC Dashboard - Metrics Widget and Page', () => {
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

  describe(`${fasrcClusterProfile}: Should display Metrics page`, () => {
        
    it('Help section', () => {
      navigateToMetrics()
      cy.get('div.metrics-help').should('be.visible')
      cy.get('div.metrics-help div.introduction').should('be.visible')
      cy.get('div.metrics-help div.description').should('be.visible')        
    })
  })
})