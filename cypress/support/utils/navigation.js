export const NAVIGATION = {
  baseUrl: Cypress.env('dashboard_baseUrl'),
  rootPath: Cypress.env('dashboard_rootPath'),
}
export const navigateToApplication = applicationName => {
  cy.get('nav li.dropdown a[title="Interactive Apps"]').click()
  cy.get(`nav li.dropdown a[title="Interactive Apps"] ~ ul a[title="${applicationName}"]`).click()
}

export const visitApplication = appToken => {
  const auth = cy.sid.auth
  const qs = cy.sid.query_params
  cy.visit(`${Cypress.env('dashboard_rootPath')}/batch_connect/${appToken}/session_contexts/new`, { auth, qs })
}

export const loadHomepage = () => {
  const rootPath = Cypress.env('dashboard_rootPath')
  const auth = cy.sid.auth
  const qs = cy.sid.query_params
  cy.visit(rootPath, { auth, qs })
}

export const navigateActiveJobs = () => {
  cy.get('nav li.dropdown a[title="Jobs"]').click()
  cy.get('nav a[title="Jobs"] ~ ul a[title="Active Jobs"]').click()
}

export const navigateJobComposer = () => {
  cy.get('nav li.dropdown a[title="Jobs"]').click()
  cy.get('nav li.dropdown a[title="Jobs"] ~ ul a[title="Job Composer"]').then($jobComposerLink => {
    const url = $jobComposerLink.prop('href')
    const auth = cy.sid.auth
    const qs = cy.sid.query_params
    cy.visit(url, { auth, qs })
  })
}

export const navigateFiles = () => {
  cy.get('nav li.dropdown a[title="Files"]').click()
  cy.get('nav li.dropdown a[title="Files"] ~ ul a[title="Home Directory"]').click()
}

export const navigateSessions = () => {
  cy.get('nav a[title="My Interactive Sessions"]').click()
}

export const navigateToSupport = () => {
  cy.get('nav li.dropdown a[title="Help"]').click()
  cy.get('nav li.dropdown a[title="Help"] ~ ul a[title="Submit Support Ticket"]').click()
}