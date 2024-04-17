# Getting Started

This application requires a couple of dependencies to run.

1. [Node.js](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/get-started/install/install-ngrok)

## Running the application

1. Clone the repository
2. Run `npm install` to install the dependencies
3. [Optional] Login to Ngrok using your auth token by running `ngrok authtoken <YOUR_AUTH_TOKEN>`
4. [Optional] Start the Ngrok tunnel by running `npm run tunnel`
5. Run `npm run shopify:dev` to start the development server and initiate Shopify development environment

Note that the tunnel is only necessary in order to test the authorization grant flow when installing Shopify integration. This is because Shopify will redirect the user to your app's URL to complete the authorization flow. Once complete, you can stop the tunnel.
