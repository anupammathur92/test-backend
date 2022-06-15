const express = require("express");
const Joi = require('joi');
const router = express.Router()
const authorize=require("../../admin/middleware/authorize.middleware");
const validateAllFieldsRequest = require("../../admin/middleware/validatefieldsrequest");
const userController = require('../../admin/Controller/admin.usercontroller');

function loginschema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    validateAllFieldsRequest(res, req, next, schema);
}

function logoutSchema(req, res, next) {
    next();
}

function employeeCreateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email()
    });
    validateAllFieldsRequest(res, req, next, schema);
}

function employeeUpdateSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    });
    validateAllFieldsRequest(res, req, next, schema);
}

function employeeDeleteSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().required(),
    });
    validateAllFieldsRequest(res, req, next, schema);
}

router.post('/login', loginschema, userController.Login);
router.post('/logout',authorize,logoutSchema,userController.logout);

//user//
router.get('/employee',authorize , userController.employeeList);
router.post('/employee',authorize, employeeCreateSchema ,userController.employeeCreate);
router.put('/employee',authorize, employeeUpdateSchema ,userController.employeeUpdate);
router.delete('/employee',authorize, employeeDeleteSchema ,userController.employeeDelete);

module.exports = router;  