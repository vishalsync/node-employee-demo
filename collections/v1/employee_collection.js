// Local module
const { createCollection } = require("../../helpers/v1/db_connection_helper");

createCollection("employee", {
    validator: {
        "$jsonSchema": {
            bsonType: "object",
            required: ["name", "age", "email", "date_of_birth", "address", "photo"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "name must be a string and is required"
                },
                age: {
                    bsonType: "int",
                    description: "age must be an integer and is required"
                },
                email: {
                    bsonType: "string",
                    description: "email must be a string and is required"
                },
                date_of_birth: {
                    bsonType: "date",
                    description: "date_of_birth must be a date and is required"
                },
                address: {
                    bsonType: "string",
                    description: "address must be a string and is required"
                },
                photo: {
                    bsonType: "object",
                    required: ["src", "alt"],
                    properties: {
                        src: {
                            bsonType: ["string", "null"],
                            description: "src must be a string or null and is required"
                        },
                        alt: {
                            bsonType:[ "string", "null"],
                            description: "alt must be a string or null and is required"
                        },
                    }
                },// End of photo property
            }
        }
    }
})//