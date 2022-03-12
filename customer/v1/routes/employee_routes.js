const router = require("express").Router();

// Third party packages
const { body } = require("express-validator");
const multer = require("multer");


// middlewares
const dataValidityMiddleware = require("../middlewares/data_validity_middleware");

// controlles
const { getEmployee, getEmployeeById, addEmployee, updateEmployee, deleteEmployee } = require("../controllers/employee_controller");


const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/employee");
    },
    filename: (req, file, cb) => {

        let fileName = file.originalname.split(" ").join("-");
        fileName = (`${Date.now()}-${fileName}`).toLocaleLowerCase();

        cb(null, fileName);
    },
});

const upload = multer({storage: diskStorage});


router.get("/employee", getEmployee);

router.get("/employee/:_id", getEmployeeById);

router.post("/employee", 
    upload.single("employee_image"),
    [
        body("name", "Employee Name is required").notEmpty(),
        body("age", "Age is required").notEmpty(),
        body("email", "Wmail is required").notEmpty().isEmail().withMessage("Please provide valid email address."),
    ],
    dataValidityMiddleware,
    addEmployee
);

router.put("/employee", 
    upload.single("employee_image"),
    [
        body("name", "Employee Name is required").notEmpty(),
        body("age", "Age is required").notEmpty(),
        body("email", "Wmail is required").notEmpty().isEmail().withMessage("Please provide valid email address."),
    ],
    dataValidityMiddleware, updateEmployee
);

router.delete("/employee/:_id", deleteEmployee);


module.exports = router;