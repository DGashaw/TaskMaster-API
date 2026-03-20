const {app} = require("../app.js");
const http = require("http");

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';


http.createServer(app).listen(PORT, HOSTNAME, async() => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT} under ${process.env.NODE_ENV} enviroment`);
});

