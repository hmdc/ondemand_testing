import { visitApplication } from "./navigation.js";

export const startAppSession = (app) => {
  visitApplication(app.token)
  cy.get('div[role="main"] h3').should('contain.text', app.name)
  cy.task('log', `Starting app: ${app.token}`)
  launchCurrentApp(app.gpu)
}

export const launchCurrentApp = (gpu= false) => {
  const partition = gpu ? cy.sid.gpu_partition : cy.sid.partition
  cy.task('log', `Overridden partition: ${partition}`)
  cy.get('form#new_batch_connect_session_context input#batch_connect_session_context_bc_queue').clear()
  if (partition) {
    cy.get('form#new_batch_connect_session_context input#batch_connect_session_context_bc_queue').type(partition)
  }
  cy.get('form#new_batch_connect_session_context input[type="submit"]').click()
  cy.get('div.container-md > div.alert-danger').contains('OnDemand requires a newer version of the browser').then(($invalidBrowserMessage) => {
    if ($invalidBrowserMessage.length) {
      // DISMISS INVALID BROWSER MESSAGE IF AVAILABLE
      cy.wrap($invalidBrowserMessage).find('button').click();
    }
  });
  cy.get('div.container-md > div.alert-success').should('exist');
}

export const checkSession = (app, supportTicketEnabled=true) => {
  //THERE SHOULD BE ONLY CURRENT SESSION RUNNING
  // CALL cleanupSessions BEFORE STARTING THE CURRENT ONE
  const longRunningTimeout = cy.sid.timeout

  cy.get('div.session-panel[data-id]', { timeout: longRunningTimeout }).should('be.visible')
  cy.get('div.session-panel[data-id]').should('have.length', 1)
  //WAIT UNTIL RUNNING
  cy.get('div.session-panel[data-id] div.card-heading div.float-right', { timeout: longRunningTimeout }).should('contain.text', 'Running')
  cy.get('div.session-panel[data-id] div.card-heading a').invoke('text').should('match', new RegExp(app.name, 'i'))

  //GET ALL PANEL ITEMS
  cy.get('div.session-panel[data-id]').find('.card-body p strong').then($sessionPanelInfoTitles => {
    const titlesArray = $sessionPanelInfoTitles.map((index, $item, c) => $item.innerText.trim().toLowerCase()).get()
    //CHECKING SOME OF THE SESSION TITLES
    expect(titlesArray).to.contain('host:')
    expect(titlesArray).to.contain('created at:')
    expect(titlesArray).to.contain('time remaining:')
    expect(titlesArray).to.contain('session id:')
    if (false) {
      expect(titlesArray).to.contain('problems with this session?')
    }
  })
}

export const deleteSession = sessionId => {
  cy.on('window:confirm',function(confirmationText){
    expect(confirmationText).to.contain('Are you sure')
  })
  cy.task('log', `Deleting session: ${sessionId}`)
  cy.get(`div#batch_connect_sessions div[data-id="${sessionId}"]`).should('be.visible')
  cy.get(`div#batch_connect_sessions div[data-id="${sessionId}"]`).then($session => {
    if ($session.find('div button.btn-cancel').length > 0) {
      $session.find('div button.btn-cancel').click()
      cy.get('div.alert-success').should('contain.text', 'Session was successfully')
      cy.get('div.alert-success button').click()
    }

    cy.get(`div#batch_connect_sessions div[data-id="${sessionId}"]`).should('be.visible')
    cy.get(`div#batch_connect_sessions div[data-id="${sessionId}"]`).find('div button.btn-delete').click()
    //PARTIAL TEXT CHECK => BETTER RESILIENCE
    cy.get('div.alert-success').should('contain.text', 'Session was successfully')
    cy.get('div.alert-success button').click()
  })
}

export const cleanupSessions = () => {
  cy.get('nav a[title="My Interactive Sessions"]').click()
  cy.get("body").then($body => {
    const $sessions = $body.find("div#batch_connect_sessions div.session-panel")
    if ($sessions.length == 0){
      return
    }

    cy.task('log', `sessions to cancel: ${$sessions.length}`)
    const sessionId = $sessions.first().attr('data-id')
    deleteSession(sessionId)

    cleanupSessions()
  })
}