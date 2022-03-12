// Third party packages
const { Int32, ObjectId } = require("mongodb");

// Local modules
const { getCollection } = require("../../../helpers/v1/db_connection_helper");
const removeUndefinedValues = require("../../../helpers/v1/remove_undefined_values");


exports.getEmployee = async (req, res, next) => {

    try {

        const employeeList = await getCollection("employee").aggregate([
            {
                $project: {
                    name: 1, age: 1, email: 1, date_of_birth: 1, address: 1,
                    photo: {
                        src: {
                            $concat: [`${req.protocol}://${req.headers.host}/`, "$photo.src"]
                        },
                        alt: "$photo.alt"
                    }
                }
            }            
        ]).toArray();

        res.json({
            data: employeeList
        });

    } catch(error) { next(error) }

}// End of getEmployee function


exports.getEmployeeById = async (req, res, next) => {

    const { _id } = req.params;

    try {

        if(!ObjectId.isValid(_id)) {
            throw {
                message: "Your employee id is Invalid.",
                details: " It must be in hexa decimail format and 12 char long.",
                statusCode: 422
            };
        }

        const [employee] = await getCollection("employee").aggregate([
            {
                $match: { _id: ObjectId(_id) }
            },
            {
                $project: {
                    name: 1, age: 1, email: 1, date_of_birth: 1, address: 1,
                    photo: {
                        src: {
                            $concat: [`${req.protocol}://${req.headers.host}/`, "$photo.src"]
                        },
                        alt: "$photo.alt"
                    }
                }
            }            
        ]).toArray();

        res.json({
            data: employee
        });

    } catch(error) { next(error) }

}// End of getEmployeeById function


exports.addEmployee = async (req, res, next) => {

    const { name, age, email, date_of_birth, address } = req.body;

    try {

        const file = req.file;

        const insertedResult = await getCollection("employee").insertOne({
            name, email, address,
            age: Int32(age),
            date_of_birth: new Date(date_of_birth), 
            photo: {
                src: file ? `employee/${file.filename}` : null,
                alt: name
            }
        });

        res.status(201).json({
            message: "Employee is inserted successfully.",
            data: insertedResult
        });

    } catch(error) { next(error) }

}// End of addEmployee function


exports.updateEmployee = async (req, res, next) => {

    const { _id, name, age, email, date_of_birth, address } = req.body;

    try {

        if(!ObjectId.isValid(_id)) {
            throw {
                message: "Your employee id is Invalid.",
                details: " It must be in hexa decimail format and 12 char long.",
                statusCode: 422
            };
        }

        const file = req.file;


        const employeeData = removeUndefinedValues({
            name, email, address,
            age: Int32(age),
            date_of_birth: new Date(date_of_birth), 
            "photo.src": file ? `employee/${file.filename}` : null,
            "photo.alt": name,
        });


        const updatedResult = await getCollection("employee").updateOne(
            {
                _id: ObjectId(_id)
            },
            {
                $set: employeeData
            }
        );

        const { modifiedCount, matchedCount} = updatedResult;

        let message = "Employee updated successfully.";
        if(!matchedCount) message = "Resource not found";
        else if(!modifiedCount) message = "Employee not updated.";

        res.status(matchedCount ? 200 : 404).json({
            message,
            data: updatedResult
        });

    } catch(error) { next(error) }

}// End of updateEmployee function



exports.deleteEmployee = async (req, res, next) => {

    const { _id } = req.params;

    try {

        if(!ObjectId.isValid(_id)) {
            throw {
                message: "Your employee id is Invalid.",
                details: " It must be in hexa decimail format and 12 char long.",
                statusCode: 422
            };
        }

        const deletedReulst = await getCollection("employee").deleteOne({_id: ObjectId(_id)});

        const { deletedCount } = deletedReulst;

        let message = "Employee has been removed successfully.";
        if(!deletedCount) message = "Resource not .";

        res.status(deletedCount ? 200 : 404).json({
            message,
            data: deletedReulst
        });

    } catch(error) { next(error) }

}// End of deleteEmployee function  