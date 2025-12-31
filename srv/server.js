const cds = require('@sap/cds');
const cors = require("cors");
const adapterProxy = require("@sap/cds-odata-v2-adapter-proxy");


cds.on('bootstrap', app => {
  app.use(adapterProxy());
  app.use(cors());

  // Middleware para manejar sap-language
  app.use((req, res, next) => {
    const sapLanguage = req.query['sap-language'];
    if (sapLanguage) {
      req.headers['accept-language'] = sapLanguage;
    }
    next();
  });

  // Endpoint de health check
  app.get('/alive', (_, res) => {
    res.status(200).send('Server is Alive');
  });
});

if (process.env.NODE_ENV !== "production") {

  const swagger = require('cds-swagger-ui-express');
  cds.on('bootstrap', app => app.use(swagger()));

  require("dotenv").config();
}

module.exports = cds.server;
