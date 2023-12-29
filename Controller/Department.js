const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setDepartment = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try{
        if (!req.body.DepartmentName) {
            res.json({ status: 0, message: "Please Enter DepartmentName", data: null, error: null });
        }
 
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.DepartmentID ? 'Update' : 'Insert'},
                {name : 'DepartmentID' , value : req.body.DepartmentID ? req.body.DepartmentID : null},
                {name : 'AdminID' , value : req.cookies.UserData.UserID},
                {name : 'DepartmentName' , value : req.body.DepartmentName ? req.body.DepartmentName : null},
            ]

            try{
                const result = await dataAccess.execute(`SP_Department`, data);
                if (result.rowsAffected == 1) {
                   res.redirect('/allDepatment')
            }
            else{
                res.status(200).json({ status: 0, message: "Can't able to Find ID", data: null, error: null });
            }

        }
        catch(error){
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }
    }
}
    
catch(error){
    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
}
    }
}
];


exports.addDepatmnt = async(req,res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    res.render('Panel/add-department',{name,id,type})
    }
}




exports.getDepartment = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value: (req.body.DepartmentID) ? (req.body.DepartmentID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Department`, data);
        if (result.recordset && result.recordset[0]) {
            const Departmentdata = result.recordset;
            if (Departmentdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Departmentdata, error: null });
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


exports.editDepartment = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;
        await Connection.connect();
        console.log(req.body.DepartmentID);
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value: (req.params.id)},
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Department`, data1);
        if (result.recordset && result.recordset[0]) {
            const data = result.recordset;
            if (data.length > 0) {
                console.log(data)
                res.render('Panel/edit-department',{name,id,type,data})
            }
            else {
                res.redirect('/error')
            }
        }
        else {
            res.redirect('/error')
        }
    } catch (error) {
        res.redirect('/error')
    }
}
}];



exports.getAllDepartment = async (req,res)=>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;


    await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value:  null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Department`, data1);
        const data = result.recordset



    res.render('Panel/department-table',{name,id,type,data})

    
    }
}

exports.removeDepartment = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {

    
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'DepartmentID', value: req.params.id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Department`, data);
            if (result.rowsAffected == 1) {
              res.redirect('/allDepatment')
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}];