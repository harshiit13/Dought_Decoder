const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();



var multer = require('multer');
const moment = require("moment");
const fs = require('fs')
const path = require('path');


const BannerImageDIR = "./public/uploads/AboutUs";
 console.log("BannerImageDIR", BannerImageDIR);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, BannerImageDIR)
    },
    filename: function (req, file, cb) {
        const fileName = `${moment().format("DD_MM_YYYY_HH_mm_ss")}` + '.png';
        cb(null, fileName)
    }
});

const imageFilter = function (req, file, cb) {
    
    var ext = path.extname(file.originalname);
    if (file.fieldname == 'AboutUsImage') {
        if (!['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'].includes(ext)) {
            req.fileValidationError = 'only .jpg , png , jpeg';
            return cb(new Error('only .jpg , png , jpeg'), false);
        }
    } else {
        req.fileValidationError = 'invaild file';
        return cb(new Error('invaild file'), false);
    }
    cb(null, true)
}




exports.setAboutUs = [async (req, res) => {


    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('AboutUsImage')
    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.json({ status: 0, message: req.fileValidationError, data: [], error: null });
        } else {
            try {
                // console.log("req.body---------setBanner---------", req.body);
                // console.log("req.file---------setBanner---------", req.file);

                await Connection.connect();
                console.log("File Name == ",req.file);
                var banner_image = ''

                if (req.file) {
                    banner_image = req.file ? req.file.filename : null
                }
                 else {
                    banner_image = req.body.AboutUsImage ? req.body.AboutUsImage : null
                }



    try{
        if (!req.body.Title) {
            res.json({ status: 0, message: "Please Enter Title", data: null, error: null });
        }
        else if (!req.body.Description) {
            res.json({ status: 0, message: "Please Enter Description", data: null, error: null });
        }
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.AboutUsID ? 'Update' : 'Insert'},
                {name : 'Title' , value : req.body.Title ? req.body.Title : null},
                {name : 'AboutUsImage' , value :banner_image ? banner_image : null},
                {name : 'AboutUsID' , value : req.body.AboutUsID ? req.body.AboutUsID : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'Description' , value : req.body.Description ? req.body.Description : null}
            ]

            try{
                const result = await dataAccess.execute(`SP_AboutUs`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.AboutUsID) {
                        res.redirect('/home')
                    }
                    else {
                        res.redirect('/home')
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
}}
catch(error){
    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
}}
})
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