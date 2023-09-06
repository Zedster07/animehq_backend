const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '',      // by default: '1.0.0'
    title: '',        // by default: 'REST API'
    description: '',  // by default: ''
  },
  host: '',      // by default: 'localhost:3000'
  basePath: '/',  // by default: '/'
  schemes: [],   // by default: ['http']
  consumes: ['application/json'],  // by default: ['application/json']
  produces: [],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: 'Users',         // Tag name
      description: 'Users service',  // Tag description

    },
    {
      name:"Roles",
      description : "Roles service"
    },
    {
      name:"Meta",
      description : "Meta service"
    }
    // { ... }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
    // Define other security schemes if needed
  },  // by default: empty object
  definitions: {},          // by default: empty object (Swagger 2.0)
  components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/userRoutes.js', './routes/roleRoutes.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);