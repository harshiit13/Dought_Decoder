const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection');
const { response } = require('../app');

const router = express.Router();


var multer = require('multer');
const moment = require("moment");
const fs = require('fs')
const path = require('path');


const BannerImageDIR = "./public/uploads/Teacher";
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
    if (file.fieldname == 'TeacherPhoto') {
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






exports.setTeacher = [async (req, res) => {
    if(!req.cookies){
        res.redirect('/login',{error : 0})
    }


    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('TeacherPhoto')
    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.json({ status: 0, message: req.fileValidationError, data: [], error: null });
        } else {
            try {
                // console.log("req.body---------setBanner---------", req.body);
                // console.log("req.file---------setBanner---------", req.file);

                await Connection.connect();
                console.log("File Name == ",req.file);
``
                var banner_image = ''

                if (req.file) {
                    banner_image = req.file ? req.file.filename : null
                }
                 else {
                    banner_image = req.body.TeacherPhoto ? req.body.TeacherPhoto : null
                }
                try{
                    if (!req.body.DepartmentID) {
                        res.json({ status: 0, message: "Please Enter DepartmentID", data: null, error: null });
                    }
                    else if (!req.body.Name) {
                        res.json({ status: 0, message: "Please Enter Name", data: null, error: null });
                    }
                    else if (!req.body.Mobile) {
                        res.json({ status: 0, message: "Please Enter Mobile", data: null, error: null });
                    }
                    else if (!req.body.UserName) {
                        res.json({ status: 0, message: "Please Enter UserName", data: null, error: null });
                    }
                    else if (!req.body.Address) {
                        res.json({ status: 0, message: "Please Enter Address", data: null, error: null });
                    }
                    else if (!req.body.Password) {
                        res.json({ status: 0, message: "Please Enter Password", data: null, error: null });
                    }
                    else if (!req.body.EmailID) {
                        res.json({ status: 0, message: "Please Enter EmailID", data: null, error: null });
                    }
                    else {
                        await Connection.connect();
            
                        var data = [
                            {name:'Query' , value: req.body.TeacherID ? 'Update' : 'Insert'},
                            {name : 'DepartmentID' , value : req.body.DepartmentID ? req.body.DepartmentID : null},
                            {name : 'Name' , value : req.body.Name ? req.body.Name : null},
                            {name : 'TeacherID' , value : req.body.TeacherID ? req.body.TeacherID : null},
                            {name : 'Password' , value : req.body.Password ? req.body.Password : null},
                            {name : 'Mobile' , value : req.body.Mobile ? req.body.Mobile : null},
                            {name : 'UserName' , value : req.body.UserName ? req.body.UserName : null},
                            {name : 'TeacherPhoto' , value : banner_image ? banner_image : null},
                            {name : 'Address' , value : req.body.Address ? req.body.Address : null},
                            {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                            {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null}
                        ]
            
                        try{
                            const result = await dataAccess.execute(`SP_Teacher`, data);
                            console.log("Banner img",banner_image)
                            if (result.rowsAffected == 1) {
                                 
                                   res.redirect('/Teacher')
                                    
                            }
                        
                        else{
                            res.status(200).json({ status: 1, message: "Can't able to Find ID", data: null, error: null });
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
            
            
            }catch(error){
                res.redirect('/error')
    
                    }        }
})}]

    


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
//         else if (!req.body.TeacherPhoto) {
//             res.json({ status: 0, message: "Please Enter TeacherPhoto", data: null, error: null });
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
//                 {name : 'TeacherPhoto' , value : banner_image ? banner_image : null},
//                 {name : 'Address' , value : req.body.Address ? req.body.Address : null},
//                 {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
//                 {name : 'EmailID' , value : req.body.EmailID ? req.body.EmailID : null}
//             ]

//             try{
//                 const result = await dataAccess.execute(`SP_Teacher`, data);
//                 console.log(result)
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


exports.viewTeacher = async(req,res) => {
    if(!req.cookies){
        res.redirect('/login',{error : 0})
    }


    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;

    if(type=="Admin"){
        const id = req.body.TeacherID;

        
    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'TeacherID', value: id },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Teacher`, data1);
    const data = result1.recordset

    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result2 = await dataAccess.execute(`SP_Department`, data2);
    const data3 = result2.recordset


console.log(data)
    res.render('Panel/teacher-master-update',{name,id,type,data,data3})
    }else{


    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'TeacherID', value: id },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Teacher`, data1);
    const data = result1.recordset

    var data2 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result2 = await dataAccess.execute(`SP_Department`, data2);
    const data3 = result2.recordset



    res.render('Panel/teacher-master-update',{name,id,type,data,data3})
}




}

exports.getTeacher = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/login',{error : 0})
    }
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherID', value: (req.body.TeacherID) ? (req.body.TeacherID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'DepartmentID', value: (req.body.DepartmentID) ? (req.body.DepartmentID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Teacher`, data);
        if (result.recordset && result.recordset[0]) {
            const Teacherdata = result.recordset;
            if (Teacherdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Teacherdata, error: null });
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

exports.getAllTeacher = async (req,res)=>{


    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{


    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'TeacherID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result = await dataAccess.execute(`SP_Teacher`, data1);
    const data = result.recordset
    function formatDate(inputDate) {
        const date = new Date(inputDate);

        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
      
        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
      
        return formattedDate;
      }
      for (d of data){
     d.BirthDate = formatDate(d.BirthDate);
      }
  

    res.render('Panel/teacher-table',{name,id,type,data})
    }
}

exports.TeacherMaster = async(req,res) =>  {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    if(!req.cookies){
        res.redirect('/login',{error : 0})
    }

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;


    await Connection.connect();
    var data1 = [
        { name: 'Query', value: 'SelectAll' },
        { name: 'DepartmentID', value: null },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },
    ]
    const result1 = await dataAccess.execute(`SP_Department`, data1);
    const data = result1.recordset



    res.render('Panel/teacher-master',{name,id,type,data})

}
}


exports.removeTeacher = [async (req, res) => {
    if(!req.cookies.UserData){
        res.render('/login',{error : 0})
    }else{
        
    try {
        const type = req.cookies.UserData[0].UserType;
    
        if (!req.params.id) {
            res.json({ status: 0, message: "Please Enter TeacherID", data: null, error: null });
        }
        else {
            await Connection.connect();


          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'TeacherID', value: req.params.id },
                { name: 'IsDelete', value: false }
            ]
            const result = await dataAccess.execute(`SP_Teacher`, data);
            if (result.rowsAffected == 1) {

                res.redirect('/Teacher');
                
            }
            else {
                res.redirect('/error')
            }
        }
    } catch (error) {
        res.redirect('/error')
    }
}
}
];

