const path = require('path');
const fs = require('fs');
const MESSAGE_INDENTATION = '     '

const getCustomConfig = (envName) => {
  const envPath = path.resolve(process.cwd(), `ondemand/cypress.env.json.${envName}`)
  if (fs.existsSync(envPath)) {
    return JSON.parse(fs.readFileSync(envPath));
  }
  return {};
};

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
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
      log(message) {
        console.log(MESSAGE_INDENTATION + message)
        return null
      }
  })

  const oodEnvironment = process.env['OOD_ENVIRONMENT'] || 'local'
  const oodConfig = oodEnvironment.includes('.') ? oodEnvironment.split('.')[0] : oodEnvironment;
  console.log(`Using oodEnvironment: ${oodEnvironment}`)
  console.log(`Using oodConfig: ${oodConfig}`)

  const customEnv = getCustomConfig(oodConfig)
  config.env = { ...config.env, ...customEnv }

  const credentialsPath = path.resolve(process.cwd(), 'credentials.json')

  if (fs.existsSync(credentialsPath)) {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
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

  const ondemandServers = {
    "local" : "https://localhost:33000",
    "dev-cannon.a" : "https://b-dev-cannonooda.rc.fas.harvard.edu/",
    "dev-cannon.a1": "https://b-dev-cannonooda-01.rc.fas.harvard.edu/",
    "dev-cannon.a2": "https://b-dev-cannonooda-02.rc.fas.harvard.edu/",
    "dev-fasse.a" : "https://h-dev-fasseooda.rc.fas.harvard.edu/",

    "dev-cannon.b" : "https://b-dev-cannonoodb.rc.fas.harvard.edu/",
    "dev-cannon.b1": "https://b-dev-cannonoodb-11.rc.fas.harvard.edu/",
    "dev-cannon.b2": "https://b-dev-cannonoodb-12.rc.fas.harvard.edu/",
    "dev-fasse.b" : "https://h-dev-fasseoodb.rc.fas.harvard.edu/",
 
    "qa-cannon.a" : "https://b-qa-cannonooda.rc.fas.harvard.edu/",
    "qa-fasse.a" : "https://h-qa-fasseooda.rc.fas.harvard.edu/",

    "prod-cannon" : "https://rcood.rc.fas.harvard.edu/",
    "prod-cannon.a" : "https://b-cannonooda.rc.fas.harvard.edu/",
    "prod-cannon.a1" : "https://b-cannonooda-01.rc.fas.harvard.edu/",
    "prod-cannon.a2" : "https://b-cannonooda-02.rc.fas.harvard.edu/",
    "prod-cannon.a3" : "https://b-cannonooda-03.rc.fas.harvard.edu/",
    "prod-cannon.a4" : "https://b-cannonooda-04.rc.fas.harvard.edu/",
    "prod-cannon.a5" : "https://b-cannonooda-05.rc.fas.harvard.edu/",
    "prod-cannon.a6" : "https://b-cannonooda-06.rc.fas.harvard.edu/",
    "prod-cannon.b" : "https://b-cannonoodb.rc.fas.harvard.edu/",
    "prod-cannon.b1" : "https://b-cannonoodb-11.rc.fas.harvard.edu/",
    "prod-cannon.b2" : "https://b-cannonoodb-12.rc.fas.harvard.edu/",
    "prod-cannon.b3" : "https://b-cannonoodb-13.rc.fas.harvard.edu/",
    "prod-cannon.b4" : "https://b-cannonoodb-14.rc.fas.harvard.edu/",
    "prod-cannon.b5" : "https://b-cannonoodb-15.rc.fas.harvard.edu/",
    "prod-cannon.b6" : "https://b-cannonoodb-16.rc.fas.harvard.edu/",
    "prod-cannon.c" : "https://b-cannonoodc.rc.fas.harvard.edu/",
    "prod-cannon.c1" : "https://b-cannonoodc-21.rc.fas.harvard.edu/",
    "prod-cannon.c2" : "https://b-cannonoodc-22.rc.fas.harvard.edu/",
    "prod-cannon.c3" : "https://b-cannonoodc-23.rc.fas.harvard.edu/",
    "prod-cannon.c4" : "https://b-cannonoodc-24.rc.fas.harvard.edu/",
    "prod-cannon.c5" : "https://b-cannonoodc-25.rc.fas.harvard.edu/",
    "prod-cannon.c6" : "https://b-cannonoodc-26.rc.fas.harvard.edu/",

    "prod-fasse" : "https://fasseood.rc.fas.harvard.edu/",
    "prod-fasse.a" : "https://h-fasseooda.rc.fas.harvard.edu/",
    "prod-fasse.a1" : "https://h-fasseooda-01.rc.fas.harvard.edu/",
    "prod-fasse.a2" : "https://h-fasseooda-02.rc.fas.harvard.edu/",
    "prod-fasse.b" : "https://h-fasseoodb.rc.fas.harvard.edu/",
    "prod-fasse.b1" : "https://h-fasseoodb-11.rc.fas.harvard.edu/",
    "prod-fasse.b2" : "https://h-fasseoodb-12.rc.fas.harvard.edu/",
    "prod-fasse.c" : "https://h-fasseoodc.rc.fas.harvard.edu/",
    "prod-fasse.c1" : "https://h-fasseoodc-21.rc.fas.harvard.edu/",
    "prod-fasse.c2" : "https://h-fasseoodc-22.rc.fas.harvard.edu/",
  }

  const app_url = ondemandServers[oodEnvironment]
  if (!app_url) {
    console.log(`Invalid OOD Environment: ${oodEnvironment}`)
    return Promise.reject(new Error(`Invalid OOD Environment: ${oodEnvironment}`))
  }

  config.baseUrl = app_url
  config.env['baseUrl'] = app_url

  const credentialsCheck = config.env['dashboard_username'] && config.env['dashboard_password'] ? 'provided' : 'not provided'
  console.log(`Dashboard credentials: ${credentialsCheck} - username: ${config.env['dashboard_username']}`)

  console.log(`Using Dashboard baseUrl: ${config.baseUrl}`)
  console.log(`Using Landing Site baseUrl: ${config.env['landing-page_baseUrl']}`)
  return config
}
