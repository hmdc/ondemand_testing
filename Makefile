# default build target
all:: ondemand
.PHONY: sid fasrcv3 ondemand

WARNING=\033[0;32m
NC=\033[0m
DOCKER_NODE_IMAGE := node:18
DOCKER_CYPRESS_IMAGE := cypress/base:18.16.0
WORKING_DIR := $(shell pwd)
# PROXY NOT REQUIRED WHEN CONNECTED TO @iqssrc
FASSE_ENV := env no_proxy=.harvard.edu http_proxy=http://rcproxy.rc.fas.harvard.edu:3128 https_proxy=http://rcproxy.rc.fas.harvard.edu:3128

# Add FASSE proxy when running against FASSE environment.
# Proxy not required when connected to @iqssrc. Here just for reference
ifeq "$(CONFIG)" "remote-fasse"
    ENV:=$(FASSE_ENV)
endif

sid:
	@echo -e "${WARNING}For FASSE and Cannon environments, you need to be connected to the VPN${NC}"
	cp -rf ./sid/cypress.env.json.$(CONFIG) cypress.env.json
	$(ENV) npm install && $(ENV) ./node_modules/.bin/cypress run --headless --spec cypress/e2e/sid-dashboard/*

fasrcv3:
	@echo "${WARNING}For FASSE and Cannon environments, you need to be connected to the VPN${NC}"
	cp -rf ./ondemand/cypress.env.json.$(CONFIG) cypress.env.json
	$(ENV) npm install && $(ENV) ./node_modules/.bin/cypress run --headless --spec "cypress/e2e/ondemand/fasrcv3/*.cy.js"

ondemand:
	@echo "${WARNING}For FASSE and Cannon environments, you need to be connected to the VPN${NC}"
	cp -rf ./ondemand/cypress.env.json.$(CONFIG) cypress.env.json
	$(ENV) npm install && $(ENV) ./node_modules/.bin/cypress run --headless --spec "cypress/e2e/ondemand/*.cy.js,cypress/e2e/ondemand/fasrc/*.cy.js,cypress/e2e/ondemand/sid/*.cy.js"
