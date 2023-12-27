const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setTeacherSubjectDetail = [async (req, res) => {
    if(req.cookies){

    try{
        if (!req.body.SubjectID) {
            res.json({ status: 0, message: "Please Enter SubjectID", data: null, error: null });
        }
        
        else {
            await Connection.connect();
            
            console.log("Subject detaiulsssss ==",req.body.SubjectID)
            const tid = req.body.TeacherID


            for(var Sub of req.body.SubjectID){
                var que = "Insert"


                var data1 = [
                    {name:'Query' , value: "SelectAll" },
                    {name : 'TeacherSubjectDetailID' , value : req.body.TeacherSubjectDetailID ? req.body.TeacherSubjectDetailID : null},
                    {name : 'SubjectID' , value : Sub ? Sub : null},
                    {name : 'TeacherID' , value : tid ? tid : null},
                    { name: 'IsActive', value: true },
                    { name:  'IsDelete', value: false },
                ]

                    
                    const result1 = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data1);
                    const subs = result1.recordset
                    console.log(subs);

                    for(var s of subs){
                        console.log(s.TeacherID,tid,s.SubjectID,Sub)
                        if(s.TeacherID == tid && s.SubjectID == Sub){
                            que = "Update";
                            console.log(que)
                            break;
                        }
                    }
                    console.log(que)
            var data = [
                {name:'Query' , value: que },
                {name : 'TeacherSubjectDetailID' ,vvalue : null },
                {name : 'SubjectID' , value : Sub ? Sub : null},
                {name : 'TeacherID' , value : tid ? tid : null},
                {name : 'CourseID' , value : req.body.CourseID ? req.body.CourseID : null},
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false }
            ]

            try{
                
                const result = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data);

        }
        catch(error){
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }
    }
    res.redirect('/showTeacherSubjectDetail')
    }
}
catch(error){
    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
}
}

else{
    res.redirect('/login' , {error:0})

}
}
];



exports.getTeacherSubjectDetail = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherSubjectDetailID', value: (req.body.TeacherSubjectDetailID) ? (req.body.TeacherSubjectDetailID) : null },
            { name: 'TeacherID', value: (req.body.TeacherID) ? (req.body.TeacherID) : null },
            { name: 'SubjectID', value: (req.body.SubjectID) ? (req.body.SubjectID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data);
        if (result.recordset && result.recordset[0]) {
            const TeacherSubjectDetaildata = result.recordset;
            if (TeacherSubjectDetaildata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: TeacherSubjectDetaildata, error: null });
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
}
];


exports.addTeacherSubjectDetail = async(req,res) =>{
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;


    if(req.cookies){


        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherID', value: id },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result1 = await dataAccess.execute(`SP_Teacher`, data1);
        const data = result1.recordset

           
    

        const DepartmentID = data[0].DepartmentID


        var data2 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value: DepartmentID },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result2 = await dataAccess.execute(`SP_Department`, data2);
        const data3 = result2.recordset


        var data2 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CourseID', value: null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result3 = await dataAccess.execute(`SP_Course`, data2);
        const Coursedata = result3.recordset
        const courses = []
        const cid = []

        Coursedata.forEach(couse => {
            if(couse.DepartmentID == DepartmentID){
                courses.push(couse)
                cid.push(couse.CourseID)
            }
        });




        var data5 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'SubjectID', value: null },
            { name: 'IsDelete', value: true }
        ]
        const result5 = await dataAccess.execute(`SP_Subject`, data5);
        const subs = result5.recordset
        const subjects = []


        subs.forEach(sub => {
            if(cid.includes(sub.CourseID)){
                subjects.push(sub)
            }
        });



        res.render('Panel/teacher-subject-detail',{name,id,type,data,data3,courses,subjects})

}
    else{
        res.redirect('/Login')
    }
}
}

exports.showDetails = async(req,res) =>{
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
                { name: 'TeacherSubjectDetailID', value: (req.body.TeacherSubjectDetailID) ? (req.body.TeacherSubjectDetailID) : null },
                { name: 'TeacherID', value: id ? id : null },
                { name: 'SubjectID', value: (req.body.SubjectID) ? (req.body.SubjectID) : null },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]
            const result = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data1);
            data = result.recordset
            if (result.recordset && result.recordset[0]) {
                const TeacherSubjectDetaildata = result.recordset;
                if (TeacherSubjectDetaildata.length > 0) {
                    console.log("abourt to render")
                   res.render('Panel/teacher-subject-show',{name,id,type,data})
                }
                else {
                    res.redirect('/addTeacherSubjectDetail')
                }
            }
            else {
                res.redirect('/addTeacherSubjectDetail')
            }
        } catch (error) {
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }



    }
}


exports.BindSubject = async(req,res) =>{

    try {
        console.log("Inside Bind Subject")
        console.log(req.params.id)
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherSubjectDetailID', value: null },
            { name: 'TeacherID', value: req.params.id },
            { name: 'SubjectID', value: null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        console.log("Abourt to execute que")
        const result = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data);
        if (result.recordset && result.recordset[0]) {
            const TeacherSubjectDetaildata = result.recordset;
            console.log(TeacherSubjectDetaildata)
            if (TeacherSubjectDetaildata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: TeacherSubjectDetaildata, error: null });
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


exports.removeTeacherSubjectDetail = [async (req, res) => {
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {

        
            const id = req.params.id;
            await Connection.connect();

          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'TeacherSubjectDetailID', value: id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_TeacherSubjectSDetail`, data);
            if (result.rowsAffected == 1) {
                res.redirect('/showTeacherSubjectDetail')
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            }
        }
    catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}
];