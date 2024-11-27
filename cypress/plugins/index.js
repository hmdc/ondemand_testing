const path = require('path');
const fs = require('fs');
const MESSAGE_INDENTATION = '     '
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
      log(message) {
        console.log(MESSAGE_INDENTATION + message)
        return null
      }
  })
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const credentialsPath = path.resolve(process.cwd(), 'credentials.json')

  if (fs.existsSync(credentialsPath)) {
    let rawdata = fs.readFileSync(credentialsPath);
    let credentials = JSON.parse(rawdata);
    config.env['dashboard_username'] = credentials.username
    config.env['dashboard_password'] = credentials.password
    console.log(`Credentials loaded from: ${credentialsPath}`)
  }

  if (process.env['OOD_USERNAME']) {
    config.env['dashboard_username'] = process.env['OOD_USERNAME']
    console.log('Overriding username with $OOD_USERNAME')
  }
  
  if (process.env['OOD_PASSWORD']) {
    config.env['dashboard_password'] = process.env['OOD_PASSWORD']
    console.log('Overriding password with $OOD_PASSWORD')
  }

  const ondemandEnvironments = {
    "dev-cannon.a" : "https://b-dev-cannonooda.rc.fas.harvard.edu/",
    "dev-fasse.a" : "https://h-dev-fasseooda.rc.fas.harvard.edu/",

    "qa-cannon.a" : "https://b-qa-cannonooda.rc.fas.harvard.edu/",
    "qa-fasse.a" : "https://h-qa-fasseooda.rc.fas.harvard.edu/",

    "prod-cannon" : "https://rcood.rc.fas.harvard.edu/",
    "prod-cannon.a" : "https://b-cannonooda.rc.fas.harvard.edu/",
    "prod-cannon.b" : "https://b-cannonoodb.rc.fas.harvard.edu/",
    "prod-cannon.c" : "https://b-cannonoodc.rc.fas.harvard.edu/",

    "prod-fasse" : "https://fasseood.rc.fas.harvard.edu/",
    "prod-fasse.a" : "https://h-fasseooda.rc.fas.harvard.edu/",
    "prod-fasse.b" : "https://h-fasseoodb.rc.fas.harvard.edu/",
    "prod-fasse.c" : "https://h-fasseoodc.rc.fas.harvard.edu/",
  }

  const ood_environment = process.env['OOD_ENVIRONMENT']
  const app_url = ondemandEnvironments[ood_environment]
  console.log(`Using environment: ${ood_environment}`)

  config.baseUrl = app_url
  config.env['baseUrl'] = app_url

  const credentialsCheck = config.env['dashboard_username'] && config.env['dashboard_password'] ? 'provided' : 'not provided'
  console.log(`Dashboard credentials: ${credentialsCheck} - username: ${config.env['dashboard_username']}`)

  console.log(`Using Dashboard baseUrl: ${config.baseUrl}`)
  console.log(`Using Landing Site baseUrl: ${config.env['landing-page_baseUrl']}`)
  return config
}
