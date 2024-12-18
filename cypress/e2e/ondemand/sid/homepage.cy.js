import {NAVIGATION, loadHomepage, visitApplication} from "../../../support/utils/navigation.js";
import { changeProfile } from "../../../support/utils/profiles.js";
import { cleanupSessions, checkSession} from "../../../support/utils/sessions.js";

describe('Sid Dashboard - Homepage', () => {
  const activePinnedApps = cy.sid.ondemandApplications.filter(l => Cypress.env('sid_pinned_apps').includes(l.id))
  const demoApp = cy.sid.ondemandApplications.filter(l => l.id == Cypress.env('interactive_sessions_app')).shift()
  const launchApplications = Cypress.env('launch_applications')
  const partition = cy.sid.partition
  Cypress.config('baseUrl', NAVIGATION.baseUrl);

  before(() => {
    loadHomepage()
    changeProfile(cy.sid.profiles.sid.title)
  })

  beforeEach(() => {
    //DEFAULT SIZE FOR THESE TESTS
    cy.viewport(cy.sid.screen.largeWidth, cy.sid.screen.height)
    loadHomepage()
    cleanupSessions()
    loadHomepage()
  })

  it('Sid Welcome message', () => {
    cy.get('div.welcome-message h2').should($homepageTitle => {
      const welcomeText = Cypress.env('dashboard_welcome_text')
      expect(cy.sid.normalize($homepageTitle.text())).to.match(new RegExp(welcomeText, 'i'))
    })
  })

  activePinnedApps.forEach( app => {
    it(`Sid Pinned Apps: ${app.id} - launchApplications: ${launchApplications}`, () => {
      cy.get(`div[data-toggle="launcher-button"] p.app-title:contains(${app.name})`).should('be.visible')

      const appUrl = `${NAVIGATION.rootPath}/batch_connect/${app.token}/session_contexts`
      //CHECK IF USING CUSTOM PINNED APPS WIDGET
      cy.get(`div[data-toggle="launcher-button"] form[action="${appUrl}"] button[type="submit"]`).then(submitButton => {
        if (submitButton.length > 0) {
          submitButton.first().click()
        } else {
          //STANDARD PINNED APPS FROM OSC
          //CHECK PINNED APPS TEXT
          //CHECK URL IS POST
          cy.get(`div[data-toggle="launcher-button"] a:contains(${app.name})`).should($launcherLink =>{
            expect($launcherLink.attr('data-method')).to.equal('post')
            expect($launcherLink.attr('href')).to.match(new RegExp(`${app.token}/session_contexts$`))
          })
          cy.get(`div[data-toggle="launcher-button"] a[href="${appUrl}"]`).should('be.visible')
          cy.get(`div[data-toggle="launcher-button"] a[href="${appUrl}"]`).click()
        }

        checkSession(app)
      }) 
    })
  })

  it('Should display Active Sessions Widget', () => {
    cleanupSessions()
    visitApplication(demoApp.token)
    //LAUNCH APP WITH EMPTY PARAMETERS
    cy.get('form#new_batch_connect_session_context input[type="submit"]').click()
    checkSession(demoApp)

    // ACTIVE SESSION WIDGET SHOULD APPEAR
    loadHomepage()
    cy.get('div.active-sessions-header h3').should($activeSessionsTitle => {
      expect(cy.sid.normalize($activeSessionsTitle.text())).to.match(new RegExp('active interactive sessions', 'i'))
    })
    checkSession(demoApp)

  })

  const QUICK_LINKS_ASSERTS = {
    terminal: () => {
      cy.get('#link-terminal-button').find('a').should($quickLinkElement => {
        expect($quickLinkElement.attr('href')).to.match(/.pun.sys.shell.ssh./i)
        expect(cy.sid.normalize($quickLinkElement.text())).to.match(/start a web based terminal session/i)
      })
    },
    sessions: () => {
      cy.get('#link-all-sessions-button').find('a').should($quickLinkElement => {
        expect($quickLinkElement.attr('href')).to.match(/.batch_connect.sessions/i)
        expect(cy.sid.normalize($quickLinkElement.text())).to.match(/view all interactive apps/i)
      })
    },
    fasse: () => {
      cy.get('#link-fasse-button').find('a').should($quickLinkElement => {
        expect($quickLinkElement.attr('href')).to.equal('https://fasseood.rc.fas.harvard.edu/')
        expect($quickLinkElement.attr('target')).to.equal('_blank')
        expect(cy.sid.normalize($quickLinkElement.text())).to.match(/medium risk data .* connect to fasse/i)
      })
    },
    cannon: () => {
      cy.get('#link-cannon-button').find('a').should($quickLinkElement => {
        expect($quickLinkElement.attr('href')).to.equal('https://vdi.rc.fas.harvard.edu/')
        expect($quickLinkElement.attr('target')).to.equal('_blank')
        expect(cy.sid.normalize($quickLinkElement.text())).to.match(/low risk data .* connect to cannon/i)
      })
    }
  }

  it('Quick link buttons', () => {
    const quickLinks = Cypress.env('quick_links')
    cy.get('div#quick-links-container').find('div.app-launcher').as('quickLinks')
    cy.get('@quickLinks').should('have.length', quickLinks.length)

    quickLinks.forEach(linkId => {
      QUICK_LINKS_ASSERTS[linkId]()
    })
  })

  it('Documentation main sections', () => {
    cy.get('div.docs-sections-container h3').should($sectionTitles => {
      expect($sectionTitles).to.have.length(5)
      expect($sectionTitles.eq(0).text()).to.match(/getting started/i)
      expect($sectionTitles.eq(1).text()).to.match(/documentation/i)
      expect($sectionTitles.eq(2).text()).to.match(/training/i)
      expect($sectionTitles.eq(3).text()).to.match(/support/i)
      expect($sectionTitles.eq(4).text()).to.match(/system status and planned downtime/i)
    })
  })

})