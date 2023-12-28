const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setBookingSlot = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    try{
        if (!req.body.DepartmentID) {
            res.redirect('/bookslot')
      
        }
        else if (!req.body.TeacherID) {
            res.redirect('/bookslot')
        }
        else if (!req.body.TeacherTimeSlotDetailID) {
            res.redirect('/bookslot')
        }
        else if (!req.body.Title) {
            res.redirect('/bookslot')
        }
        else if (!req.body.Description) {
            res.redirect('/bookslot')
        }
        else if (!req.body.Status) {
            res.redirect('/bookslot')
        }
        
        else {
            await Connection.connect();
            var data = [
                {name:'Query' , value: req.body.BookingID ? 'Update' : 'Insert'},
                {name : 'StudentID' , value : req.cookies.UserData[0].UserID  },
                {name : 'BookingID' , value : req.body.BookingID ? req.body.BookingID : null},
                {name : 'SubjectID' , value : req.body.SubjectID ? req.body.SubjectID : null},
                {name : 'DepartmentID' , value : req.body.DepartmentID ? req.body.DepartmentID : null},
                {name : 'TeacherID' , value : req.body.TeacherID ? req.body.TeacherID : null},
                {name : 'TeacherTimeSlotDetailID' , value : req.body.TeacherTimeSlotDetailID ? req.body.TeacherTimeSlotDetailID : null},
                {name : 'Title' , value : req.body.Title ? req.body.Title : null},
                {name : 'Description' , value : req.body.Description ? req.body.Description : null},
                {name : 'Status' , value : req.body.Status ? req.body.Status : null}

            ]

            try{
                const result = await dataAccess.execute(`SP_BookingSlot`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.BookingID) {
                        res.redirect('/bookstatus')
                    }
                    else {
                        res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
                    }
            }
            else{
                res.status(200).json({ status: 2, message: "Can't able to Find ID", data: null, error: null });
            }

        }
        catch(error){
            return res.status(500).json({ status: 3, message: error.message, data: null, error: null })
        }
    }
}
catch(error){
    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
}
}
}
];


exports.getBookingSlot = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'BookingID', value: (req.body.BookingID) ? (req.body.BookingID) : null },
            { name: 'StudentID', id },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_BookingSlot`, data);
        if (result.recordset && result.recordset[0]) {
            const data = result.recordset;
            if (data.length > 0) {

                res.render('Panel/show-booking',{name,id,type,data})
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


exports.accept = async(req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const id = req.params.id
    var data = [
        { name: 'Query', value: 'Update' },
        { name: 'BookingID', value: id },
        { name: 'Status', value: "Accepted" },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false }
    ]
    const result = await dataAccess.execute(`SP_BookingSlot`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/bookingrequest')
            }
    
}
}

exports.reject = async(req,res) =>{
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const id = req.params.id
    var data = [
        { name: 'Query', value: 'Update' },
        { name: 'BookingID', value: id },
        { name: 'Status', value: "Declined" },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false }
    ]
    const result = await dataAccess.execute(`SP_BookingSlot`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/bookingrequest')
            }
        }
}


exports.bookslot = async(req,res) =>{


    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'StudentID', value: id },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result = await dataAccess.execute(`SP_Student`, data1);
    const sdata = result.recordset

    const DepartmentID = sdata[0].DepartmentID

    var data01 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'TeacherID', value: null },
        { name: 'DepartmentID', value: DepartmentID },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Teacher`, data01);
    const tdata = result1.recordset
    var tid = []
    var slots = []

    for(t of tdata){
        tid.push(t.TeacherID)
    }

    for(var i of tid){

        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherID', value: i },
            {name : 'TeacherTimeSlotDetailID' , value : null},
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data01);
        const tdata1 = result.recordset
        slots.push(tdata1)

    }

    var slotdata = slots[0]
    console.log("About to rende data",sdata,tdata,slotdata)


    res.render('Panel/booking-forrm',{name,id,type,sdata,tdata,slotdata})




    }

}


exports.requests = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    var id1 = null

    try {
        if(type == "Teacher"){
            var id1 = id
        }
        console.log("Inside request from changing " , req.params.status)
        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'BookingID', value:  null },
            { name: 'TeacherID', value : id1 },
            { name : 'Status' , value : req.params.status},
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_BookingSlot`, data1);
        if (result.recordset && result.recordset[0]) {
            const data = result.recordset;
            if (data.length > 0) {
                res.render('Panel/booking-request' , {name,id,type,data})
            }
            else {
                res.render('Panel/booking-request' , {name,id,type,data})
            }
        }
        else {
            var data = []
            res.render('Panel/booking-request' , {name,id,type,data})
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}];



exports.removeBookingSlot = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        if (!req.body.BookingID) {
            res.json({ status: 0, message: "Please Enter BookingID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'BookingID', value: req.body.BookingID },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_BookingSlot`, data);
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
}
}];