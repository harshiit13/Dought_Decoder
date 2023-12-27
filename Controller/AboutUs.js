const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setAboutUs = [async (req, res) => {

    try{
        if (!req.body.Title) {
            res.json({ status: 0, message: "Please Enter Title", data: null, error: null });
        }
        else if (!req.body.Description) {
            res.json({ status: 0, message: "Please Enter Description", data: null, error: null });
        }
        else if (!req.body.AboutUsImage) {
            res.json({ status: 0, message: "Please Enter AboutUsImage", data: null, error: null });
        }
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.AboutUsID ? 'Update' : 'Insert'},
                {name : 'Title' , value : req.body.Title ? req.body.Title : null},
                {name : 'AboutUsImage' , value : req.body.AboutUsImage ? req.body.AboutrUsImage : null},
                {name : 'AboutUsID' , value : req.body.AboutUsID ? req.body.AboutUsID : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'Description' , value : req.body.Description ? req.body.Description : null}
            ]

            try{
                const result = await dataAccess.execute(`SP_AboutUs`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.AboutUsID) {
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


exports.getAboutUs = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'AboutUsID', value: (req.body.AboutUsID) ? (req.body.AboutUsID) : null },
            { name: 'AdminID', value: (req.bodAdminUsID) ? (req.bodAdminUsID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_AboutUs`, data);
        if (result.recordset && result.recordset[0]) {
            const AboutUsdata = result.recordset;
            if (AboutUsdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: AboutUsdata, error: null });
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


exports.getAllAboutUs = async(req,res)=>{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'AboutUsID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result = await dataAccess.execute(`SP_AboutUs`, data1);
    const data = result.recordset

    res.render('Panel/aboutus-table',{name,id,type,data})


}


exports.removeAboutUs = [async (req, res) => {
    try {
        if (!req.body.AboutUsID) {
            res.json({ status: 0, message: "Please Enter AboutUsID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'AboutUsID', value: req.body.AboutUsID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_AboutUs`, data);
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