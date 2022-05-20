# MovieQuery-Sample-JS

The primary components are webservice/app.js, the backend component that pulls and processes the data, and webapp/index.js, the frontend web page.

webservice/app.js:
*Requirements: Node.js, Express, and Axios
*Run in Node.js command prompt using: set DEBUG=myapp:* & npm start
*Listens on port 3000 as local host
*Accepts GET requests in the format of http://localhost:3000/movies?search=[title]
*Collects data from TMDB and attempts to generate JSON response - Currently data is retrieved and processed but JSON result is not returned

webapp/index.js:
*Basic Node.js web page - Not functional currently
