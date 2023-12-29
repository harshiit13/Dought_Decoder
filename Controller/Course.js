const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setCourse = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        console.log("Isside Set")
        if (!req.body.DepartmentID) {
            res.json({ status: 0, message: "Please Enter DepartmentID", data: null, error: null });
        }
        else if (!req.body.CourseName) {
            res.json({ status: 0, message: "Please Enter Course Name", data: null, error: null });
        }
   



            await Connection.connect();

            var data = [
                { name: 'Query', value: req.body.CourseID ? 'Update' : 'Insert' },
                { name: 'CourseID', value: req.body.CourseID ? req.body.CourseID : null },
                { name: 'DepartmentID', value: req.body.DepartmentID ? req.body.DepartmentID : null },
                { name: 'CourseName', value: req.body.CourseName ? req.body.CourseName : null },
                { name: 'Description', value: req.body.Description ? req.body.Description : null },
                {name : 'IsActive' , value:true},
                {name:'IsDelete' , value:false}

            ]

            try {
                const result = await dataAccess.execute(`SP_Course`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.CourseID) {
                        res.redirect('/viewcourse')
                    }
                    else {
                        res.redirect('/viewcourse')
                    }
                } else {
                    res.status(200).json({ status: 1, message: "Can'r Able to find ID", data: null, error: null });
                }

            }
            catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    
    catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}
];



exports.getCourse = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

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
}
}];


exports.bindCourse = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

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
}
}];

exports.getCourseData = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        var a =  0;

        res.render('Panel/course')


    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}];

exports.removeCourse = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {

            await Connection.connect();


            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'CourseID', value: req.params.id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Course`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/viewcourse')
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            }
        
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}];


exports.addCourse = async(req,res) =>{
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;

        await Connection.connect();
        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value:null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Department`, data01);
        const data = result.recordset


        if (result.recordset && result.recordset[0]) {
            const Subjectdata = result.recordset;
            if (Subjectdata.length > 0) {
                res.render('Panel/add-course',{name,id,type,data})
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
    }
}


exports.editCourse = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    try {


        await Connection.connect();
        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value:null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result1 = await dataAccess.execute(`SP_Department`, data01);
        const data = result1.recordset


        await Connection.connect();
        var data02 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CourseID', value: req.params.id },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Course`, data02);
        if (result.recordset && result.recordset[0]) {
            const data1 = result.recordset;
            if (data.length > 0) {
                res.render('Panel/edit-course', {name,id,type,data,data1})
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
}
}];



exports.viewCourse = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    try {
        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CourseID', value: null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Course`, data1);
        if (result.recordset && result.recordset[0]) {
            const data = result.recordset;
            console.log("data============",data)
            if (data.length > 0) {
                res.render('Panel/course-table', {name,id,type,data})
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
}
}];