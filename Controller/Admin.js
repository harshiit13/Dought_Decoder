const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setAdmin = [async (req, res) => {

    try{
        if (!req.body.Name) {
            res.json({ status: 0, message: "Please Enter Name", data: null, error: null });
        }
        else if (!req.body.Mobile) {
            res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
        }
        else if (!req.body.UserName) {
            res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
        }
        else if (!req.body.Password) {
            res.json({ status: 0, message: "Please Enter Password", data: null, error: null });
        }
        else if (!req.body.UserType) {
            res.json({ status: 0, message: "Please Enter UserType", data: null, error: null });
        }
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.AdminID ? 'Update' : 'Insert'},
                {name : 'Name' , value : req.body.Name ? req.body.Name : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
                {name : 'UserName' , value : req.body.UserName ? req.body.UserName : null},
                {name : 'Password' , value : req.body.Password ? req.body.Password : null},
                {name : 'UserType' , value : req.body.UserType ? req.body.UserType : null}
            ]

            try{
                const result = await dataAccess.execute(`SP_Admin`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.AdminID) {
                        res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                    }
                    else {
                        res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                    }
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
];


exports.getAdmin = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Admin`, data);
        if (result.recordset && result.recordset[0]) {
            const Admindata = result.recordset;
            if (Admindata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Admindata, error: null });
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


// exports.register = [async (req,res) =>{
//     res.render('login')
// }]


exports.removeAdmin = [async (req, res) => {
    try {
        if (!req.body.AdminID) {
            res.json({ status: 0, message: "Please Enter AdminID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'AdminID', value: req.body.AdminID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Admin`, data);
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