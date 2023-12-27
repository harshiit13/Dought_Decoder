const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setBook = [async (req, res) => {

    try{
        if (!req.body.BookName) {
            res.json({ status: 0, message: "Please Enter BookName", data: null, error: null });
        }
        else if (!req.body.AuthorName) {
            res.json({ status: 0, message: "Please Enter AuthorName", data: null, error: null });
        }
        else if (!req.body.PublisherName) {
            res.json({ status: 0, message: "Please Enter PublisherName", data: null, error: null });
        }
        else if (!req.body.BookImage) {
            res.json({ status: 0, message: "Please Enter BookImage", data: null, error: null });
        }
        else if (!req.body.Description) {
            res.json({ status: 0, message: "Please Enter Description", data: null, error: null });
        }
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.BookID ? 'Update' : 'Insert'},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'BookID' , value : req.body.BookID ? req.body.BookID : null},
                {name : 'BookName' , value : req.body.BookName ? req.body.BookName : null},
                {name : 'AuthorName' , value : req.body.AuthorName ? req.body.AuthorName : null},
                {name : 'PublisherName' , value : req.body.PublisherName ? req.body.PublisherName : null},
                {name : 'BookImage' , value : req.body.BookImage ? req.body.BookImage : null},
                {name : 'Description' , value : req.body.Description ? req.body.Description : null}
            ]

            try{
                const result = await dataAccess.execute(`SP_Book`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.BookID) {
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


exports.getBook = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'BookID', value: (req.body.BookID) ? (req.body.BookID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Book`, data);
        if (result.recordset && result.recordset[0]) {
            const Bookdata = result.recordset;
            if (Bookdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Bookdata, error: null });
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


exports.removeBook = [async (req, res) => {
    try {
        if (!req.body.BookID) {
            res.json({ status: 0, message: "Please Enter BookID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'BookID', value: req.body.BookID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Book`, data);
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