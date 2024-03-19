// Import the required libraries
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const { Client } = require('@microsoft/microsoft-graph-client');
const config = require('./config.json');

// Import the passport Azure AD library
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

// Set the Azure AD B2C options
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    issuer: config.credentials.issuer,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    scope: config.resource.scope,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

// Instantiate the passport Azure AD library with the Azure AD B2C options
const bearerStrategy = new BearerStrategy(options, (token, done) => {
    // Send user info using the second argument
    done(null, {}, token);
});

// Use the required libraries
const app = express();

app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// API anonymous endpoint
app.get('/public', (req, res) => res.send({'date': new Date()}));

// API protected endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', { session: false }),
    async (req, res) => {
        try {
            const client = Client.init({
                authProvider: (done) => {
                    done(null, req.authInfo.access_token);
                }
            });

            const result = await client.api('/me/planner/tasks').get();
            console.log("EPTVAIMAT")
            console.log(result)
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching Planner tasks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

// Starts listening on port 6000
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
