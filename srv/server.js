const cds = require('@sap/cds');
const cors = require("cors");

cds.on('bootstrap', app => {

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

module.exports = cds.server;