
const express = require('express');
const { URLSearchParams } = require('url');
const msal = require('@azure/msal-node');
const app = express();

const clientId = '343ceba9-a004-42db-8e95-82ee7c2fd6da';
const clientSecret1 = '6N18Q~Y2KTtdsQCZF0Vb-HvzThYuZ5RiZC7ttcbt';
const tenantId = '158f15f3-83e0-4906-824c-69bdc50d9d61';

const redirectUri = 'https://localhost:3000/auth/callback';
const scopes = ['https://graph.microsoft.com/.default'];
const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        clientSecret: clientSecret1
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};


const pca = new msal.ConfidentialClientApplication(msalConfig);

pca.acquireTokenByClientCredential({
    scopes: scopes,
}).then((response) => {
    const accessToken = response.accessToken;

    import('node-fetch').then((fetch) => {
        fetch.default('https://graph.microsoft.com/v1.0/planner/plans/CCCDONX8PEW2r4pr-GsprpcABnhr/tasks', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
                }
            })
            .then(data => {
                // Process the tasks data
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }).catch((error) => {
        console.error('Error importing fetch:', error);
    });
}).catch((error) => {
    console.error('Error acquiring token:', error);
});
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await client.api('/planner/plans/CCCDONX8PEW2r4pr-GsprpcABnhr/tasks').get();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('Server is running at http://localhost:3000/');
});
module.exports = server;