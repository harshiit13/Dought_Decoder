const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setBanner = [async (req, res) => {

    try{
        if (!req.body.BannerImage) {
            res.json({ status: 0, message: "Please Enter BannerImage", data: null, error: null });
        }
       
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.BannerID ? 'Update' : 'Insert'},
                {name : 'BannerID' , value : req.body.BannerID ? req.body.BannerID : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'BannerImage' , value : req.body.BannerImage ? req.body.BannerImage : null}
            ]

            try{
                const result = await dataAccess.execute(`SP_Banner`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.BannerID) {
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

exports.getBanner = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'BannerID', value: (req.body.BannerID) ? (req.body.BannerID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Banner`, data);
        if (result.recordset && result.recordset[0]) {
            const Bannerdata = result.recordset;
            if (Bannerdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Bannerdata, error: null });
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


exports.addbanmner = async(req,res) =>{
    res.render('Panel/add-banner')
}

exports.removeBanner = [async (req, res) => {
    try {
        if (!req.body.BannerID) {
            res.json({ status: 0, message: "Please Enter BannerID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'BannerID', value: req.body.BannerID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Banner`, data);
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