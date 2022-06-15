const config = require("../../config/config.json");
const express = require("express");
const sequelize = require('sequelize');
const jwt = require("jsonwebtoken");
const response = require("../../helper/response");
const path = require('path')
const moment = require('moment');
const Op = require('sequelize').Op;

const db = require("../../models");
const bcrypt = require("bcryptjs");

const { where, DATE, and } = require("sequelize");
const { status, type } = require("express/lib/response");
const salt = bcrypt.genSalt(10);

module.exports = {
  Login: async (req, res, next) => {
    try {
      const params = req.body

      const user = await db.User.findOne({
        where: {
          email: params.email,
          role_id : 1
        }
      });
      if (!user) {
        throw "invalid email";
      }

      if (!user || !(await bcrypt.compare(params.password, user.password)))
        throw "password is incorrect.";

        // authentication successful
        const token = jwt.sign({
            sub: user.id,
            role_id: '1'
        }, config.secret, {
            expiresIn: '1d'
        });

        let data = {
          ...omitHash(user.get()),
          token
        }

        await db.User.update({
            token : token
            },{
            where: {
              id: user.id,
              role_id : 1
            }
        });

        message = "You are logged in successfully."
        return res.send(response(data, message));

    } catch (error) {
      console.log(error)
      next(error);
    }
  },
  logout: async (req, res, next) => {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const user = await db.User.update({
        token : ""
    },{
        where : {
            token : authHeader
        }
    })

    message = "You are logged out successfully."
    return res.send(response(message));
  },
  employeeList: async (req, res, next) => {
    try {
      const data = await db.User.findAll({
        where: {
          role_id: "2",
        },
      });
      return res.send(response(data));
    } catch (error) {
      next(error);
    }
  },
  employeeCreate: async (req, res, next) => {
    try {
      const params = req.body;
      params.role_id = "2";
      params.password = "";

      if (await db.User.findOne({
        where: {
          email: params.email,
        }
      })) {
        throw "Email already registered"
      }

      const employee = await db.User.create(params);
      return res.send(response(employee, "employee created."));
    } catch (error) {
      next(error)
    }
  },

  employeeUpdate: async (req, res, next) => {
    try {
      const params = req.body

      const data = Object.assign(params)
      const profile = await db.User.update(data,
        {
          where: {
            id: params.id
          }
        });
      return res.send(response("Employee updated successfully."));

    } catch (error) {
      next(error)
    }
  },
  employeeDelete: async (req, res, next) => {
    try {
        const params = req.body;

        const user = await db.User.findOne({
            where: { id: params.id },
        });

        if (user) {
          await user.destroy();
        }

        return res.send(response("Employee deleted successfully."));

    } catch (error) {
      next(error)
    }
  }
}

function omitHash(user, token = "") {
  if (token) {
    user.token = token;
  }

  const {
    password,
    ...userWithoutHash
  } = user;
  return userWithoutHash;
}