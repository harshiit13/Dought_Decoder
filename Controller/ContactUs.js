const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setContactUs = [async (req, res) => {

    try{
        if (!req.body.Name) {
            res.json({ status: 0, message: "Please Enter Name", data: null, error: null });
        }
        else if (!req.body.Mobile) {
            res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
        }
        else if (!req.body.EmailID) {
            res.json({ status: 0, message: "Please Enter EmailID", data: null, error: null });
        }
        else if (!req.body.Subject) {
            res.json({ status: 0, message: "Please Enter Subject", data: null, error: null });
        }
        else if (!req.body.Description) {
            res.json({ status: 0, message: "Please Enter Description", data: null, error: null });
        }
        
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.ContactUsID ? 'Update' : 'Insert'},
                {name : 'ContactUsID' , value : req.body.ContactUsID ? req.body.ContactUsID : null},
                {name : 'Name' , value : req.body.Name ? req.body.Name : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
                {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null},
                {name : 'Subject' , value : req.body.Subject ? req.body.Subject : null},
                {name : 'Description' , value : req.body.Description ? req.body.Description : null}

            ]

            try{
                const result = await dataAccess.execute(`SP_ContactUs`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.ContactUsID) {
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



exports.getContactUs = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'ContactUsID', value: (req.body.ContactUsID) ? (req.body.ContactUsID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_ContactUs`, data);
        if (result.recordset && result.recordset[0]) {
            const ContactUsdata = result.recordset;
            if (ContactUsdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: ContactUsdata, error: null });
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


exports.addcontactus = async(req,res) =>{



    res.render('Panel/contactus-form')

}


exports.viewcontactus = async(req,res) =>{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    
    try {
        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'ContactUsID', value: null },
            { name: 'AdminID', value:  null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_ContactUs`, data1);
        if (result.recordset && result.recordset[0]) {
            const data = result.recordset;
            if (data.length > 0) {
                console.log(data);
                res.render('Panel/contactus-info',{data,name,id,type})
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


exports.removeContactUs = [async (req, res) => {
    try {
        if (!req.body.ContactUsID) {
            res.json({ status: 0, message: "Please Enter ContactUsID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'ContactUsID', value: req.body.ContactUsID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_ContactUs`, data);
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