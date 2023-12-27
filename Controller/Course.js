const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setCourse = [async (req, res) => {

    try {
        if (!req.body.DepartmentID) {
            res.json({ status: 0, message: "Please Enter DepartmentID", data: null, error: null });
        }
        else if (!req.body.CourseName) {
            res.json({ status: 0, message: "Please Enter Course Name", data: null, error: null });
        }


        else {
            await Connection.connect();

            var data = [
                { name: 'Query', value: req.body.CourseID ? 'Update' : 'Insert' },
                { name: 'CourseID', value: req.body.CourseID ? req.body.CourseID : null },
                { name: 'DepartmentID', value: req.body.DeaprtmentID ? req.body.DeaprtmentID : null },
                { name: 'CourseName', value: req.body.CourseName ? req.body.CourseName : null }

            ]

            try {
                const result = await dataAccess.execute(`SP_Course`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.CourseID) {
                        res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                    }
                    else {
                        res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                    }
                } else {
                    res.status(200).json({ status: 1, message: "Can'r Able to find ID", data: null, error: null });
                }

            }
            catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    }
    catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
];



exports.getCourse = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CourseID', value: (req.body.CourseID) ? (req.body.CourseID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'DepartmentID', value: (req.body.DepartmentID) ? (req.body.DepartmentID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Course`, data);
        if (result.recordset && result.recordset[0]) {
            const Coursedata = result.recordset;
            if (Coursedata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Coursedata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];


exports.bindCourse = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CourseID', value: null },
            { name: 'DepartmentID', value: (req.params.id) },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Course`, data);
        if (result.recordset && result.recordset[0]) {
            const Coursedata = result.recordset;
            if (Coursedata.length > 0) {
                console.log(Coursedata)
                res.status(200).json({ status: 1, message: "Success.", data: Coursedata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getCourseData = [async (req, res) => {
    try {
        var a =  0;

        res.render('Panel/course')


    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.removeCourse = [async (req, res) => {
    try {
        if (!req.body.CourseID) {
            res.json({ status: 0, message: "Please Enter CourseID", data: null, error: null });
        }
        else {
            await Connection.connect();


            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'CourseID', value: req.body.CourseID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Course`, data);
            if (result.rowsAffected == 1) {
                res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];