require('dotenv').config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const cors = require('cors');
const { Op,condition } = require("sequelize");

const path = require("path")
const user = require("./models/user");
const db = require("./models");

const errorHandler = require('./admin/middleware/error-handler');
app.use(cors());

const PORT = process.env.PORT;
/*app.use(cors({
    origin: '*'
}));*/
const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`))
app.use((req, res, next) => {
    return next();
});

const adminRoutes = require('./admin/routes/admin.routes');
app.use(express.json()) //json allow
app.use(express.urlencoded({ extended: true })) //json allow
app.use('/app/admin', adminRoutes);
app.use(errorHandler);