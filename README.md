<h1>Litentry Task</h1>
<h2>Goal</h2>
<ul>
	<li>Provide a Web application that allows users to access a “Secret” page.</li>
	<li>Only authenticated users can reach this page.</li>
	<li>Users can sign in using a Wallet Extension by proving they own an account.</li>
</ul>
 
The project is split into 2 parts. A backend writen in node.js express and and frontend in React.
 
<h2>Server</h2>

To run: npm start <br />
To test: npm run test

The api has the following enpoints:
<ul>
	<li>POST /api/v1/signin</li>
	<li>POST /api/v1/refreshToken</li>
	<li>GET /api/v1/secret</li>
	<li>POST /api/v1/signout</li>
</ul>

The user proves they own an address by requesting the message signature using Polkadot.js extension.

In turn the backend validates this signature in a passort custom strategy. If valid a JWT token is issued via passort.js which can be used for secured requests like /api/v1/secrets.

<h2>Client</h2>

To run: npm start <br />
To test: npm test

Here we have a basic frontend written in React.

On landing the user is presented with 'Log in with polkadot' button. When clicked the payload is signed and sent to the server for authentication.

Once a session is established a token is returned and used to subsequent requests.

The session will also work accross multiple tabs and when the user logs out they will be logged out of all tabs.


