var express = require('express');
var router = express.Router();
var app = express();
app.set('view engine', 'ejs');

const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')


const UserLoginController = require("../Controller/UserLoginController");
const validation = require("../routes/validation")


router.get('/error',(req,res)=>{
    res.render('Panel/error')
})

router.get('/logout',(req,res)=>{
    res.cookie("UserData", "", { expires: new Date(0) });
    res.redirect('/Login')
})



router.get('/Profile', validation.validation, async (req,res)=>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    if(type == "Student"){
        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'StudentID', value: id },
            { name: 'DepartmentID', value: (req.body.DepartmentID) ? (req.body.DepartmentID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'CourseID', value: (req.body.CourseID) ? (req.body.CourseID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
    const result = await dataAccess.execute(`SP_Student`, data1);
    const data = result.recordset

        res.render('Panel/profile',{name,id,type,data})
    }
    if(type == "Teacher"){

        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'TeacherID', value: id ? id :null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
    const result = await dataAccess.execute(`SP_Teacher`, data1);
    const data = result.recordset
        console.log(data)
        res.render('Panel/profile',{name,id,type,data})
    }

    if(type == "Admin"){

        await Connection.connect();
        var data1 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'AdminID', value: id },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
    const result = await dataAccess.execute(`SP_Admin`, data1);
    const data = result.recordset
        console.log(data1)
        res.render('Panel/profile',{name,id,type,data})
    }
}
}
)


router.get('/Login' , (req,res)=>{
    res.render('Panel/login',{error : 0})
})


router.post('/login' , UserLoginController.chkUseLogin)



const AboutUs = require("../Controller/AboutUs")
router.post('/AboutUs/setAboutUs' , AboutUs.setAboutUs)
router.get('/AboutUs/getAboutUs' , AboutUs.getAboutUs)
router.get('/AboutUs/getAllAboutUs',AboutUs.getAllAboutUs)
router.delete('/AboutUs/removeAboutUs' , AboutUs.removeAboutUs)




const Admin = require("../Controller/Admin")
router.post('/Admin/setAdmin' , Admin.setAdmin)
router.get('/Admin/getAdmin' , Admin.getAdmin)
router.delete('/Admin/removeAdmin' , Admin.removeAdmin)




const Banner = require("../Controller/Banner")
router.post('/Banner/setBanner' , Banner.setBanner)
router.get('/Banner/getBanner' , Banner.getBanner)
router.delete('/Banner/removeBanner' , Banner.removeBanner)




const Book = require("../Controller/Book")
router.post('/Book/setBook' , Book.setBook)
router.get('/Book/getBook' , Book.getBook)
router.delete('/Book/removeBook' , Book.removeBook)




const BookingSlot = require("../Controller/BookingSlot")
router.post('/BookingSlot/setBookingSlot' , BookingSlot.setBookingSlot)
router.get('/BookingSlot/getBookingSlot' , BookingSlot.getBookingSlot)
router.get('/bookslot',BookingSlot.bookslot)
router.get('/bookstatus',BookingSlot.getBookingSlot)
router.get('/acceptBooking/:id',BookingSlot.accept)
router.get('/declineBooking/:id',BookingSlot.reject)
router.get('/bookingrequest',BookingSlot.requests)
router.delete('/BookingSlot/removeBookingSlot' , BookingSlot.removeBookingSlot)




const ContactUs = require("../Controller/ContactUs")
router.post('/ContactUs/setContactUs' ,ContactUs.setContactUs)
router.get('/ContactUs/getContactUs' , ContactUs.getContactUs)
router.delete('/ContactUs/removeContactUs' , ContactUs.removeContactUs)




const Student = require("../Controller/Student")
router.post('/Student/setStudent' , Student.setStudent)
router.get('/Student/getStudent' , Student.getStudent)
router.get('/Student/getAllStudent' , Student.getAllStudent)
router.get('/addStudent' , Student.StudentMaster)
router.get('/viewStudent' , Student.viewStudent)
router.post('/viewStudent' , Student.viewStudent)
router.delete('/Student/removeStudent' , Student.removeStudent)
router.get('/removeStudent/:id' , Student.removeStudent)




const Subject = require("../Controller/Subject")
router.post('/Subject/setSubject' , Subject.setSubject)
router.get('/Subject/getSubject' , Subject.getSubject)
router.get('/allSubject',Subject.allSubject)
router.get('/addsubject',Subject.addSubject)
router.get('/editsubject',Subject.editSubject)
router.get('/removesubject/:id',Subject.removeSubject)
router.delete('/Subject/removeSubject' , Subject.removeSubject)




const Teacher = require("../Controller/Teacher")
router.post('/Teacher/setTeacher' , Teacher.setTeacher)
router.get('/Teacher/getTeacher' , Teacher.getTeacher)
router.get('/Teacher' ,Teacher.getAllTeacher)
router.get('/addTeacher',Teacher.TeacherMaster)
router.get('/viewTeacher',Teacher.viewTeacher)
router.post('/viewTeacher',Teacher.viewTeacher)
router.get('/removeTeacher/:id' , Teacher.removeTeacher)



const TeacherSubjectDetail = require("../Controller/TeacherSubjectDetail")
router.post('/TeacherSubjectDetail/setTeacherSubjectDetail' , TeacherSubjectDetail.setTeacherSubjectDetail)
router.get('/TeacherSubjectDetail/getTeacherSubjectDetail' , TeacherSubjectDetail.getTeacherSubjectDetail)
router.get('/showTeacherSubjectDetail',TeacherSubjectDetail.showDetails)
router.get('/removeTeacherSubjectDetail/:id',TeacherSubjectDetail.removeTeacherSubjectDetail)
router.get('/addTeacherSubjectDetail' , TeacherSubjectDetail.addTeacherSubjectDetail)
router.get('/BindSubject/:id',TeacherSubjectDetail.BindSubject)
router.delete('/TeacherSubjectDetail/removeTeacherSubjectDetail' , TeacherSubjectDetail.removeTeacherSubjectDetail)



const TeacherTimeSlotDetail = require("../Controller/TeacherTimeSlotDetail")
router.get('/addTeacherTimeSlotDetail',(req,res)=>{
    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;
        res.render('Panel/teacher-timeslot',{name,id,type})

    }
})
router.post('/TeacherTimeSlotDetail/setTeacherTimeSlotDetail' , TeacherTimeSlotDetail.setTimeSlotDetail)
router.get('/TeacherTimeSlotDetail/getTeacherTimeSlotDetail' , TeacherTimeSlotDetail.getTeacherTimeSlotDetail)
router.delete('/TeacherTimeSlotDetail/removeTeacherTimeSlotDetail' , TeacherTimeSlotDetail.removeTeacherTimeSlotDetail)
router.get('/showTeacherTimeSlotDetail',TeacherTimeSlotDetail.getTeacherTimeSlotDetail)
router.post('/editTeacherTimeSlot',TeacherTimeSlotDetail.edit)
router.post('/remove/:id' ,TeacherTimeSlotDetail.removeTeacherTimeSlotDetail)



const Course = require('../Controller/Course')
router.post('/Course/setCourse', Course.setCourse)
router.get('/Course/getCourse' , Course.getCourse)
router.get('/BindCourse/:id',Course.bindCourse)
router.get('/Course' , Course.getCourseData)
router.get('/addcourse' , Course.addCourse)
router.get('/viewcourse' , Course.viewCourse)
router.get('/editcourse',Course.editCourse)
router.get('/removecourse/:id',Course.removeCourse)
router.delete('/Course/removeCourse' , Course.removeCourse)



const Department = require("../Controller/Department");
const { request } = require('../app');
router.post('/Department/setDepartment' , Department.setDepartment)
router.get('/addDepartment',Department.addDepatmnt)
router.get('/allDepatment',Department.getAllDepartment)
router.get('/editDepatment',Department.editDepartment)
router.get('/Department/getDepartment' , Department.getDepartment)
router.get('/Department/getAllDepartment' , Department.getAllDepartment)
router.get('/removeDepartment/:id' , Department.removeDepartment)

router.get("/BindTeacherTimeSlot/:id", TeacherTimeSlotDetail.getTeacherTimeSlot);


router.get('/' ,validation.validation, async(req,res)=>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    const name = req.cookies.UserData[0].Name;
    const id = req.cookies.UserData[0].UserID;
    const type = req.cookies.UserData[0].UserType;
    var data01 = [
        {name:'Query' , value: 'SelectAll'},
        {name : 'StudentID' , value : null  },
        { name: 'IsActive', value: true },
        { name: 'IsDelete', value: false },

    ]

        const result1 = await dataAccess.execute(`SP_Student`, data01);
        const sdata = result1.recordset


        var data02 = [
            {name:'Query' , value: 'SelectAll'},
            {name : 'TeacherID' , value : null  },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
    
        ]
    
            const result2 = await dataAccess.execute(`SP_Teacher`, data02);
            const tdata = result2.recordset


            var data03 = [
                {name:'Query' , value: 'SelectAll'},
                {name : 'DepartmentID' , value : null  },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
        
            ]
        
                const result3 = await dataAccess.execute(`SP_Department`, data03);
                const ddata = result3.recordset

                var data04 = [
                    {name:'Query' , value: 'SelectAll'},
                    {name : 'SubjectID' , value : null  },
                    { name: 'IsActive', value: true },
                    { name: 'IsDelete', value: false },
            
                ]
            
                    const result4 = await dataAccess.execute(`SP_Subject`, data04);
                    const sudata = result4.recordset


                    var data05 = [
                        {name:'Query' , value: 'SelectAll'},
                        {name : 'BookingID' , value : null  },
                        {name : 'Status' , value:"Pending"},
                        { name: 'IsActive', value: true },
                        { name: 'IsDelete', value: false },
                
                    ]
                
                        const result5 = await dataAccess.execute(`SP_BookingSlot`, data05);
                        const rdata = result5.recordset

                        var students = sdata.length
                        var teachers = tdata.length
                        var departments = ddata.length
                        var subjects = sudata.length
                        var bookings = rdata.length



    res.render('Panel/home',{name,id,type,students,teachers,departments,subjects,bookings})
}})


module.exports = router;