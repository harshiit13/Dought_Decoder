const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();



var multer = require('multer');
const moment = require("moment");
const fs = require('fs')
const path = require('path');


const BannerImageDIR = "./public/uploads/Student";
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
    if (file.fieldname == 'StudentPhoto') {
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










exports.setStudent = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{



    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('StudentPhoto')
    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.json({ status: 0, message: req.fileValidationError, data: [], error: null });
        } else {
            try {

                await Connection.connect();
                console.log("File Name == ",req.file);
                var banner_image = ''

                if (req.file) {
                    banner_image = req.file ? req.file.filename : null
                }
                 else {
                    banner_image = req.body.StudentPhoto ? req.body.StudentPhoto : null
                }


                

try{

    if (!req.body.DepartmentID) {
        res.json({ status: 0, message: "Please Enter DepartmentID", data: null, error: null });
    }
    else if (!req.body.CourseID) {
        res.json({ status: 0, message: "Please Enter CourseID", data: null, error: null });
    }
    else if (!req.body.Name) {
        res.json({ status: 0, message: "Please Enter Name", data: null, error: null });
    }
    else if (!req.body.Mobile) {
        res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
    }
    else if (!req.body.BirthDate) {
        res.json({ status: 0, message: "Please Enter BirthDate", data: null, error: null });
    }
    else if (!req.body.UserName) {
        res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
    }
    else if (!req.body.Semester) {
        res.json({ status: 0, message: "Please Enter Semester", data: null, error: null });
    }
    else if (!req.body.EnrollmentNo) {
        res.json({ status: 0, message: "Please Enter EnrollmentNo", data: null, error: null });
    }
    else if (!req.body.EmailID) {
        res.json({ status: 0, message: "Please Enter EmailID", data: null, error: null });
    }
    else {
        await Connection.connect();
        console.log(req.file);

        var data = [
            {name:'Query' , value: req.body.StudentID ? 'Update' : 'Insert'},
            {name : 'StudentID' , value : req.body.StudentID ? req.body.StudentID : null},
            {name : 'DepartmentID' , value : req.body.DepartmentID ? req.body.DepartmentID : null},
            {name : 'CourseID' , value : req.body.CourseID ? req.body.CourseID : null},
            {name : 'Name' , value : req.body.Name ? req.body.Name : null},
            {name : 'EnrollmentNo' , value : req.body.EnrollmentNo ? req.body.EnrollmentNo : null},
            {name : 'AdminID' , value : req.cookies.UserData[0].UserID },
            {name : 'Password' , value : req.body.Password ? req.body.Password : null},
            {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
            {name : 'UserName' , value : req.body.UserName ? req.body.UserName : null},
            {name : 'BirthDate' , value : req.body.BirthDate ? req.body.BirthDate : null},
            {name : 'StudentPhoto' , value : banner_image ? banner_image : null},
            {name : 'Semester' , value : req.body.Semester ? req.body.Semester : null},
            {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null}
        ]

        try{
            const result = await dataAccess.execute(`SP_Student`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/Student/getAllStudent')
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








            //     try{
            //         if (!req.body.DepartmentID) {
            //             res.json({ status: 0, message: "Please Enter DepartmentID", data: null, error: null });
            //         }
            //         else if (!req.body.Name) {
            //             res.json({ status: 0, message: "Please Enter Name", data: null, error: null });
            //         }
            //         else if (!req.body.Mobile) {
            //             res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
            //         }
            //         else if (!req.body.UserName) {
            //             res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
            //         }
            //         else if (!req.body.Address) {
            //             res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
            //         }
            //         else if (!req.body.Password) {
            //             res.json({ status: 0, message: "Please Enter Password", data: null, error: null });
            //         }
            //         else if (!req.body.EmailID) {
            //             res.json({ status: 0, message: "Please Enter EmailID", data: null, error: null });
            //         }
            //         else {
            //             await Connection.connect();
            
            //             var data = [
            //                 {name:'Query' , value: req.body.TeacherID ? 'Update' : 'Insert'},
            //                 {name : 'DepartmentID' , value : req.body.DepartmentID ? req.body.DepartmentID : null},
            //                 {name : 'Name' , value : req.body.Name ? req.body.Name : null},
            //                 {name : 'TeacherID' , value : req.body.TeacherID ? req.body.TeacherID : null},
            //                 {name : 'Password' , value : req.body.Password ? req.body.Password : null},
            //                 {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
            //                 {name : 'UserName' , value : req.body.UserName ? req.body.UserName : null},
            //                 {name : 'TeacherPhoto' , value : req.file.filename ? req.file.filename : null},
            //                 {name : 'Address' , value : req.body.Address ? req.body.Address : null},
            //                 {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
            //                 {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null}
            //             ]
            
            //             try{
            //                 const result = await dataAccess.execute(`SP_Teacher`, data);
            //                 console.log("Banner img",banner_image)
            //                 if (result.rowsAffected == 1) {
            //                     if (!req.body.TeacherID) {
            
            //                         //res.clearCookie('UserData')
                                 
            //                        res.redirect('/')
            //                     }
            //                     else {
            
            //                         res.clearCookie('UserData')
            //                         var AllData = [];
            //                             AllData.push({
            //                                 UserID: req.body.TeacherID,
            //                                 UserType: "Teacher",
            //                                 Name: req.body.Name
            
            //                             });
            
                
            //                         res.cookie("UserData", AllData, {
            //                             maxAge: 2000 * 3600 
            //                         });
            
            
            //                    res.redirect('/')
                                    
            //                 }
            //             }
            //             else{
            //                 res.status(200).json({ status: 1, message: "Can't able to Find ID", data: null, error: null });
            //             }
            
            //         }
            //         catch(error){
            //             return res.status(500).json({ status: 2, message: error.message, data: null, error: null })
            //         }
            //     }
            // }
            // catch(error){
            //     return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            // }



            
            
            }catch(error){
                res.send("Some Errror accured in banner upload" + error)
    
                    }        }
})}
}];



    

   

exports.viewStudent = async(req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    console.log("cookies == ",req.cookies);
    
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;


    if(type=="Admin"){
        const id = req.body.StudentID;
        
    
        
    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'StudentID', value: id },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Student`, data1);
    const Studentdata = result1.recordset
    console.log("Studentdata==================>", Studentdata)

    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result2 = await dataAccess.execute(`SP_Department`, data2);
    const Departmentdata = result2.recordset



    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'CourseID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result3 = await dataAccess.execute(`SP_Course`, data2);
    const Coursedata = result3.recordset



    res.render('Panel/student-master-update',{name,id,type,Studentdata,Departmentdata,Coursedata})
    }

    
    else{


    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'StudentID', value: id },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Student`, data1);
    const Studentdata = result1.recordset

    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result2 = await dataAccess.execute(`SP_Department`, data2);
    const Departmentdata = result2.recordset


    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'CourseID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result3 = await dataAccess.execute(`SP_Course`, data2);
    const Coursedata = result3.recordset


console.log("Studdeent data =-==",Studentdata);


    res.render('Panel/student-master-update',{name,id,type,Studentdata,Departmentdata,Coursedata})
}

}
}


exports.getStudent = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'StudentID', value: (req.body.StudentID) ? (req.body.StudentID) : null },
            { name: 'DepartmentID', value: (req.body.DepartmentID) ? (req.body.DepartmentID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'CourseID', value: (req.body.CourseID) ? (req.body.CourseID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Student`, data);
        if (result.recordset && result.recordset[0]) {
            const Studentdata = result.recordset;
            if (Studentdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Studentdata, error: null });
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


exports.getAllStudent = async (req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;



    await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'StudentID', value: null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
    const result = await dataAccess.execute(`SP_Student`, data);
    data = result.recordset

      
    res.render('Panel/student-table',{id,name,type,data})
}
}


exports.StudentMaster = async(req,res) =>{
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{


    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    console.log(id)

    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]

    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'CourseID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]


    const result1 = await dataAccess.execute(`SP_Department`, data1);
    const data = result1.recordset


    const result2 = await dataAccess.execute(`SP_Course`, data2);
    const course = result2.recordset
    console.log(course)



    res.render('Panel/student-master',{name,id,type,data,course})

}
}




exports.removeStudent = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        if (!req.params.id) {
            res.json({ status: 0, message: "Please Enter StudentID", data: null, error: null });
        }
        else {
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'StudentID', value: req.params.id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Student`, data);
            if (result.rowsAffected == 1) {
               res.redirect('/Student/getAllStudent')
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