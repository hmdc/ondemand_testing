export const closeIncident = (incidentNumber) => {
  const getIncident = createIncidentRequest({incidentNumber: incidentNumber})

  if (!getIncident) {
    return
  }

  cy.request(getIncident).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.result).to.have.length(1)

    const incidentId = response.body.result[0].sys_id
    const state = response.body.result[0].incident_state
    cy.task('log', `Found Id:${incidentId} for Incident: ${incidentNumber} with state: ${state}`)

    if (state == '7') {
      cy.task('log', `Incident: ${incidentNumber} already closed`)
      return
    }

    close(incidentId)
    cy.task('log', `Incident: ${incidentNumber} closed`)
  })
}

function createIncidentRequest({incidentNumber, incidentId}={}) {
  const authToken = Cypress.env('serviceNowToken')
  const authUser = Cypress.env('serviceNowUser')
  const authPass = Cypress.env('serviceNowPassword')

  if (!authToken && (!authUser || !authPass)) {
    cy.task('log', `Support Ticket automatic update disabled. No ServiceNow credentials available`)
    return null
  }

  const serviceNowServer = Cypress.env('serviceNowServer') || 'https://harvard.service-now.com'
  const basicIncidentUrl = new URL(serviceNowServer)
  basicIncidentUrl.pathname += `api/now/table/incident`
  if (incidentNumber) {
    basicIncidentUrl.searchParams.append('sysparm_query', `number=${incidentNumber}`)
    basicIncidentUrl.searchParams.append('sysparm_limit', '1')
  }
  if (incidentId) {
    basicIncidentUrl.pathname += `/${incidentId}`
  }

  const options = {
    method: 'GET',
    url: basicIncidentUrl.toString(),
  }

  if (authToken) options.headers = { 'x-sn-apikey': authToken }
  if (authUser) {
    options.auth = {
      username: authUser,
      password: authPass,
    }
  }

  return options
}

function close(incidentId) {
  const closeIncident = createIncidentRequest({incidentId: incidentId})
  const payload = {
    incident_state: '7',
    close_code: 'Resolved by caller',
    close_notes: 'Closing OOD automated test incident',
  }
  closeIncident.method = 'PUT'
  closeIncident.body = payload

  cy.request(closeIncident).then((response) => {
    expect(response.status).to.eq(200)
  })
}