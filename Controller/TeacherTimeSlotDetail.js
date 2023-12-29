const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setTimeSlotDetail = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{


    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    try{
        if (!req.body.StartTime) {
            res.json({ status: 0, message: "Please Enter StartTime", data: null, error: null });
        }
        else if (!req.body.EndTime) {
            res.json({ status: 0, message: "Please Enter EndTime", data: null, error: null });
        }
       
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.TeacherTimeSlotDetailID ? 'Update' : 'Insert'},
                {name : 'TeacherID' , value : id },
                {name : 'TeacherTimeSlotDetailID' , value : req.body.TeacherTimeSlotDetailID ? req.body.TeacherTimeSlotDetailID : null},
                {name : 'StartTime' , value : req.body.StartTime ? req.body.StartTime : null},
                {name : 'EndTime' , value : req.body.EndTime ? req.body.EndTime : null}
               
            ]

            try{
                const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.TeacherTimeSlotDetailID) {
                        res.redirect('/showTeacherTimeSlotDetail')
                    }
                    else {
                       res.redirect('/showTeacherTimeSlotDetail')
                    }
            }
            else{
                res.redirect('/error')
            }

        }
        catch(error){
            res.redirect('/error')
        }
    }
}
catch(error){
    res.redirect('/error')
}
    }
}
];





exports.getTeacherTimeSlotDetail = [async (req, res) => {

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
            { name: 'TeacherTimeSlotDetailID', value: null },
            {name : 'TeacherID' , value: id},
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data1);
        const data = result.recordset


        console.log(data);
        if (result.recordset && result.recordset[0]) {
            const TeacherTimeSlotDetaildata = result.recordset;
            if (TeacherTimeSlotDetaildata.length > 0) {
                res.render('Panel/show-teacher-timeslot',{name,id,type,data})
            }
            else {
               res.redirect('/addTeacherTimeSlotDetail')
            }
        }
        else {
            res.redirect('/addTeacherTimeSlotDetail')
        }
    } catch (error) {
        res.redirect('/error')
    }
}}];


exports.edit = async(req,res)=>{

    if (!req.body.TeacherTimeSlotDetailID) {
        res.json({ status: 0, message: "Please Enter TeacherTimeSlotDetailID", data: null, error: null });
    }
    else {

        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;


        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherTimeSlotDetailID', value: req.body.TeacherTimeSlotDetailID },
            {name : 'TeacherID' , value: id},
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]

        const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data1);
        const data = result.recordset


        res.render('Panel/edit-teacher-timeslot',{name,id,type,data})



    }

}


exports.removeTeacherTimeSlotDetail = [async (req, res) => {

    try {


            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'TeacherTimeSlotDetailID', value: req.params.id },
                { name: 'TeacherID', value: (req.body.TeacherID) ? (req.body.TeacherID) : null },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/showTeacherTimeSlotDetail')
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            }
        }
     catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];



exports.getTeacherTimeSlot = [async (req, res) => {
    if(!req.cookies){
        res.redirect('/login',{error : 0})
    }
    try {
        console.log("Inside get teacher time slot")
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'Bound' },
            { name: 'TeacherID', value: (req.params.id) ? (req.params.id) : null },
            { name: 'TeacherTimeSlotDetailID', value: null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_TeacherTimeSlotDetail`, data);
        if (result.recordset && result.recordset[0]) {
            const Teacherdata = result.recordset;
            if (Teacherdata.length > 0) {
                res.status(200).json({ status: 1, message: "success.", data: Teacherdata, error: null });
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
}];