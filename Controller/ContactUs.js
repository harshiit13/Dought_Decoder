const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setContactUs = [async (req, res) => {

    try{
        if (!req.body.Mobile) {
            res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
        }
        else if (!req.body.EmailID) {
            res.json({ status: 0, message: "Please Enter EmailID", data: null, error: null });
        }
        else if (!req.body.Address) {
            res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
        }
        
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value:  'Update' },
                {name : 'ContactUsID' , value : 6},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
                {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null},
                {name : 'Address' , value : req.body.Address ? req.body.Address : null}

            ]

            try{
                const result = await dataAccess.execute(`SP_ContactUs`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.ContactUsID) {
                        res.redirect('/home')
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

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    res.render('Panel/contactus-form',{name,id,type})

}


exports.viewcontactus = async(req,res) =>{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    
    try {
        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'ContactUsID', value: 6 },
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

            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'ContactUsID', value: req.params.id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_ContactUs`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/showContactus')
            }
            else {
                res.redirect('/error')
            }
        
    } catch (error) {
        res.redirect('/error')
    }
}];