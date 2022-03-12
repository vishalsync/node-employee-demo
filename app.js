// Third party packages
const express = require("express");
require("dotenv").config()

// Local module
const { initDBConnection, syncCollection } = require("./helpers/v1/db_connection_helper");
const employeRoutes = require("./customer/v1/routes/employee_routes")

const app = express();

/**
 * Setting up middleware
 */
app.use(express.urlencoded({extended: true}));// This middleware will help to parse x-www-form-urlencoded data.
app.use(express.json());// This middleware will help to parse json data.

//Middleware for CORS error.
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
});

app.use(express.static("public"));


// employee routes
app.use("/customer/v1", employeRoutes);




// Handling unknown routes and method 
app.use((req, res, next) => {

    res.status(405).json({
        mesage: "Method or Endpoint not supported.",
    });
});


// Handling errors
app.use((error, req, res, next) => {

    console.log(error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        error
    });

});


const PORT = process.env.PORT || "8080";

initDBConnection()
    .then(async () => {
        await syncCollection();

        app.listen(PORT, () => {
            console.log("APP is running of port =", PORT);
        });

    });
