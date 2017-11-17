'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: '"https://localhost"',
  TEST_TOKEN: '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTA4OTk0OTEsIm9wYXF1ZV91c2VyX2lkIjoiVTIzNDM1NTUzIiwidXNlcl9pZCI6IjIzNDM1NTUzIiwiY2hhbm5lbF9pZCI6IjIzNDM1NTUzIiwicm9sZSI6ImJyb2FkY2FzdGVyIiwicHVic3ViX3Blcm1zIjp7Imxpc3RlbiI6WyJicm9hZGNhc3QiLCJ3aGlzcGVyLVUyMzQzNTU1MyJdLCJzZW5kIjpbIioiXX19.h3uL6es59h1ylOL-PeZdMJANVNLeZGM7vRrVjeO3EcE"'
})
