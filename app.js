const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const taskApiRoutes = require("./routes/taskApiRoutes.js");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("node:path");


require('dotenv').config();

require("./config/dbConnect.js").dbConnect;




app.use(bodyParser.json());

switch(app.get("env")){
    case "development":
        app.use(morgan(process.env.REQUEST_LOG_FORMAT || "dev", {
            stream: process.env.REQUEST_LOG_FILE ?
            rfs.RotatingFileStream(path.join(__dirname, process.env.REQUEST_LOG_FILE),
            {
                size: "10M", // rotate every 10 MegaBytes written
                interval: "1d", // rotate daily
                compress: "gzip"
            
            }) :
            process.stdout
            
        }))
        break;
    case "production":
        const stream = rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: "10M", // rotate every 10 MegaBytes written
            interval: "1d", // rotate daily
            compress: "gzip"
        })
        app.use(morgan, {stream});
        break;
}
app.use("/api/v1", taskApiRoutes);

module.exports = {app,};
