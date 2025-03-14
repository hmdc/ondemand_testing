import { NAVIGATION, loadHomepage, navigateToMetrics } from "../../../support/utils/navigation.js";
import {changeProfile} from "../../../support/utils/profiles";

describe('Sid Dashboard - Metrics Widget and Page', () => {
  const fasrcClusterProfile = Cypress.env('fasrc_cluster_profile')
  Cypress.config('baseUrl', NAVIGATION.baseUrl);
  const clusterName = Cypress.env('cluster_name')

  before(() => {
    loadHomepage()    
    changeProfile(cy.sid.profiles.sid.title)
  })

  beforeEach(() => {
    //DEFAULT SIZE FOR THESE TESTS
    cy.viewport(cy.sid.screen.largeWidth, cy.sid.screen.height)
    loadHomepage()
  })

  describe('Should display Metrics page', () => {
        
    it('Help section', () => {
      navigateToMetrics()
      cy.get('div.metrics-help').should('be.visible')
      cy.get('div.metrics-help').contains('h3','Metrics Help').should('be.visible')
      cy.get('div.metrics-help div.introduction').should('be.visible')
      cy.get('div.metrics-help div.description').should('be.visible') 
      cy.get('div.metrics-help div.description').contains('h5','FairShare').should('be.visible') 
      cy.get('div.metrics-help div.description').contains('h5','Completed Jobs by State').should('be.visible') 
      cy.get('div.metrics-help div.description').contains('h5','Summary Job Stats').should('be.visible') 
      cy.get('div.metrics-help div.description').contains('strong','Understanding Efficiency Metrics').should('be.visible')
      cy.get('div.metrics-help div.partition-widget-help').contains('h4','Partition Status Widget').should('be.visible')

    })

    it('Widget section', () => {
        navigateToMetrics()
        cy.get('div.metrics').should('be.visible')
        cy.get('div.metrics').contains('h3',`${clusterName} Cluster Metrics`).should('be.visible')
        cy.get('div.metrics .metrics-widget-component .card .card-header').contains('h3','Fairshare').should('be.visible')
        cy.get('div.metrics .metrics-widget-component .card .card-header').contains('h3','CPU Jobs by State').should('be.visible')
        cy.get('div.metrics .metrics-widget-component .card .card-header').contains('h3','GPU Jobs by State').should('be.visible')
        cy.get('div.metrics .metrics-widget-component .card .card-header').contains('h3','Summary Job Stats').should('be.visible')
        cy.get('.partition-widget-component .card .card-header').contains('h3','Partition Status').should('be.visible')
      })
  })
})