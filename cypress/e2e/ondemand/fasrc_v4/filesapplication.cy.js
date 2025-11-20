import { NAVIGATION, loadHomepage, navigateFiles } from "../../../support/utils/navigation.js";
import {changeProfile} from "../../../support/utils/profiles";

describe('FASRC Dashboard - Files Application', () => {
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

  it(`${fasrcClusterProfile}: Should display files application page`, () => {
    navigateFiles()

    // SHOULD DISPLAY FAVORITES
    cy.get('ul#favorites a').should($favorites => {
      expect($favorites.first().text().trim()).to.match(/home directory/i)
    })

    // SHOULD DISPLAY BREADCRUMBS
    cy.get('ol#path-breadcrumbs').should('have.length', 1)
  })

})