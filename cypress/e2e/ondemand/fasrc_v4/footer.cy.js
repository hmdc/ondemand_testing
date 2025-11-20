import { NAVIGATION, loadHomepage } from "../../../support/utils/navigation.js";
import {changeProfile} from "../../../support/utils/profiles";

describe('FASRC Dashboard - Footer', () => {
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

  it(`${fasrcClusterProfile}: Should display version and host`, () => {
    cy.get('footer').then($versions => {
        cy.task('log', `Version and Host: ${$versions.eq(0).text().trim()}`)
      })
  })

  it(`${fasrcClusterProfile}: Should display footer expected logos with link`, () => {
    cy.get('footer a').should($logos => {
      expect($logos).to.have.length(3)

      expect($logos.eq(0).attr('href')).to.equal('https://openondemand.org')
      expect($logos.eq(0).find('img').attr('alt')).to.match(/powered by open ondemand/i)

      expect($logos.eq(1).attr('href')).to.equal('https://www.rc.fas.harvard.edu')
      expect($logos.eq(1).find('img').attr('alt')).to.match(/fasrc/i)

      expect($logos.eq(2).attr('href')).to.equal('https://www.iq.harvard.edu/')
      expect($logos.eq(2).find('img').attr('alt')).to.match(/iqss/i)
    })
  })

  it(`${fasrcClusterProfile}: Should display footer expected text elements`, () => {
    cy.get('footer span.footer_version').should($versions => {
      expect($versions).to.have.length(2)

      expect($versions.eq(0).text()).to.match(/you are on/i)
      expect($versions.eq(1).text()).to.match(/ondemand version:/i)
    })
  })

})