
## Satoshi's Law is an application for lawyers to track thier billable hours and be paid for them via the bitcoin lightning network.

### This app was built for the Bitcoin Games Hackathon put on for the Bitcoin2019 Conference -- https://www.bitcoin2019conference.com/hackathon

Special thanks to William O'Beirne for writing a Lightning App tutorial, which I relied on to get the backend of my application communicating with my lightning node. That tutorial can be found here: https://medium.com/@wbobeirne/making-a-lightning-web-app-part-1-4a13c82f3f78

##Technologies

* React
* Node
* Express
* Bootstrap/Reactstrap

##APIs

* Clockify (for logging time sessions) https://clockify.me/developers-api

## Installation

If you want to try this application locally, you will need to clone this repository (for the backend) as well as this one (for the frontend) https://github.com/joshakeman/satoshis-law

You can find the directions to run the frontend of this app at that URL. Both will need to be running for the app to work.

**For the backend to actually work with your lightning node, you'll need to configure your .env file

William O'Beirne explains how to do this nicely in part 1 of his tutorial, and I followed his instructions to make this work, so you should probably go look there. But, here are the steps:

* Create a .env file in the root directory. There is a env.example file included in the cloned repository that provides a template for what your .env file will look like.
* replace the three variables under 'LND Node configuration' with your own node's information. This tool can help you figure out where to find this information (https://lightningjoule.com/tools/node-info). Again, this is all taken from the Medium post linked above:
--*Replace the port in the lnd url with the port for your node, like so: 127.0.0.1:[port]
--*Find the folder holding your node's macaroons (will be somewhere kind of like this: data/chain/bitcoin/mainnet). That folder will contain an 'invoice' file. In your terminal you can run 'base64 invoice.macaroon' or you can do the same by dragging that file into an online tool for base64 encoding files. Past the result in the LND_MACAROON vairable in your .env file
--*Find the tls.cert file for your node in the data directory and do the same thing: 'base64 tls.cert'... paste the result in the LND_TLS_CERT variable.
--*Save your .env file with those changes

Now your lightning node is configured, hopefully.

Make sure to install all dependencies for the backend by running yarn install (or npm equivalent).

Next you'll want to spin up the backend by running the 'dev:server' script. So I would run 'yarn dev:server' or you can use npm.

Now your server should be running at http://localhost:3001

If you also have the frontend of the app running, then everything should work! Enjoy.
