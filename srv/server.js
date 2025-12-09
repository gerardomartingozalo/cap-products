const cds = require('@sap/cds');

cds.on('bootstrap', app => {
  app.use((req, res, next) => {
    const sapLanguage = req.query['sap-language'];
    if (sapLanguage) {
      req.headers['accept-language'] = sapLanguage;
    }
    next();
  });
});

module.exports = cds.server;