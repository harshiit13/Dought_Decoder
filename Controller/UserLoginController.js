const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection');

const router = express.Router();

exports.chkUseLogin = [async (req, res) => {

    try {
        var bodyUserName = req.body.UserName;
        var bodyPassword = req.body.Password;
        var bodyUserType = req.body.UserType;

        if (!bodyUserName) {
            res.render({ status: 0, message: "Please Enter UserName", data: null, error: null });
        }
        else if (!bodyPassword) {
            res.render({ status: 0, message: "Please Enter Password", data: null, error: null });
        }
        else if (!bodyUserType) {
            res.render({ status: 0, message: "Please Enter User Type", data: null, error: null });
        }
        else {
            await Connection.connect();

            var data = [
                { name: 'Query', value: 'Login' },
                { name: 'UserName', value: bodyUserName ? bodyUserName : null },
                { name: 'Password', value: bodyPassword ? bodyPassword : null },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false }
            ]

            try {
                let result;
                if (bodyUserType == "Admin") {
                    result = await dataAccess.execute(`SP_Admin`, data);
                }
                else if (bodyUserType == "Student") {
                    result = await dataAccess.execute(`SP_Student`, data);
                }
                else if (bodyUserType == "Teacher") {
                    result = await dataAccess.execute(`SP_Teacher`, data);
                } else {
                    res.render({ status: 0, message: "Please Select User Type", data: null, error: null });
                }
                if (result.recordset && result.recordset[0]) {


                    var AllData = [];

                    if (bodyUserType == "Admin") {
                        AllData.push({
                            UserID: result.recordset[0].AdminID,
                            UserType: result.recordset[0].UserType,
                            Name: result.recordset[0].Name,
                           
                        });

                    }

                    if (bodyUserType == "Student") {
                        AllData.push({
                            UserID: result.recordset[0].StudentID,
                            UserType: result.recordset[0].UserType,
                            Name: result.recordset[0].Name,
                        });

                    }

                    if (bodyUserType == "Teacher") {
                        AllData.push({
                            UserID: result.recordset[0].TeacherID,
                            UserType: result.recordset[0].UserType,
                            Name: result.recordset[0].Name,
                        });

                    }


                    res.cookie("UserData", AllData , {
                        maxAge: 2000 * 3600 
                    });
                    if (bodyUserType == "Admin"){
                        res.redirect('/home')
                    }

                    if (bodyUserType == "Teacher"){
                        res.redirect('/bookingrequest')
                    }

                    if (bodyUserType == "Student"){
                        res.redirect('/bookslot')
                    }
                    

                }
                else {
                    res.render('Panel/login',{ error : 1 })
                }

            }
            catch (error) {
                return res.status(500).json({ status: 1, message: error.message, data: null, error: null })
            }
        }
    }
    catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }

}
]; 