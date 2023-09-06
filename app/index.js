// Routes

const paymentRoutes =  require('./routes/payment-routes/paymentRoutes');
const couponRoutes =  require('./routes/coupon-routes/couponRoutes');
// Subscription Routes
const subscriptionRoutes = require('./routes/subscription-routes/subscriptionRoutes');

// Auth Routes
const userRoutes = require('./routes/auth-routes/userRoutes');
const roleRoutes = require('./routes/auth-routes/roleRoutes');
const metaRoutes = require('./routes/auth-routes/metaRoutes');




/////////////////////////////


// APP Dependencies
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const {sequelize} = require('./config/database');
const swaggerDocument = require('./swagger-output.json');
const useragent = require('express-useragent');
const app = express();
const config = require('./config/config');
/////////////////////////////



app.use(useragent.express());
app.use(bodyParser.json());
const retry = require('retry');
const { initial_data } = require('./utils');

const operation = retry.operation({
  retries: 5, // Number of retry attempts
  factor: 2, // Exponential backoff factor
  minTimeout: 1000, // Minimum time (in milliseconds) between retries
  maxTimeout: 10000, // Maximum time (in milliseconds) between retries
  randomize: true, // Randomize the timeouts
});


operation.attempt(currentAttempt => {
  console.log(`Attempting to connect to the database (Attempt ${currentAttempt})`);

  sequelize
    .authenticate()
    .then(() => {
      sequelize.sync().then(() => {
        console.log('Database synced');
        initial_data();
      }).catch(error => {
        console.error('Error syncing database:', error);
      });
    })
    .catch(error => {
      console.error(`Error connecting to the database (Attempt ${currentAttempt}):`);
      if (operation.retry(error)) {
        return;
      }
      console.error('Max retry attempts reached');
    });
});


// Sync the database models

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Subscription Routes
app.use(subscriptionRoutes);

// Subscription Routes
app.use(paymentRoutes);

// Subscription Routes
app.use(couponRoutes);


// Mount userRoutes under the /api/users path
app.use(userRoutes);

// Mount roleRoutes under the /api/roles path
app.use(roleRoutes);

// Meta Routes
app.use(metaRoutes);





const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Microservice listening at http://localhost:${port}`);
});
