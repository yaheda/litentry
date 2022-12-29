const { createProxyMiddleware, fixRequestBody  } = require('http-proxy-middleware');
const bodyParser = require('body-parser')

module.exports = function(app) {
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
};