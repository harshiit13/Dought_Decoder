const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setCity = [async (req, res) => {
    try {
        if (!req.body.StateID) {
            res.json({ status: 0, message: "Please Enter StateID", data: null, error: null });
        }
        else if (!req.body.CityName) {
            res.json({ status: 0, message: "Please Enter City Name", data: null, error: null });
        }
        else {
            try {
                await Connection.connect();
                // var checkcitynamedata = [
                //     { name: 'Query', value: 'CheckCityNameData' },
                //     { name: 'CityID', value: (req.body.CityID) ? (req.body.CityID) : null },
                //     { name: 'StateID', value: req.body.StateID },
                //     { name: 'CityName', value: req.body.CityName },
                //     { name: 'IsDelete', value: '1' },
                // ]

                // const CheckCityNameResult = await dataAccess.execute(`SP_City`, checkcitynamedata);
                // const citynamedata = CheckCityNameResult.recordset;
                // if (citynamedata.length > 0) {
                //     return res.status(200).json({ status: 0, message: 'City Name Already Exists!', data: null, error: null })
                // }
                //else
                {
                    var data = [
                        { name: 'Query', value: req.body.CityID ? 'Update' : 'Insert' },
                        { name: 'CityID', value: (req.body.CityID) ? (req.body.CityID) : null },
                        { name: 'StateID', value: req.body.StateID },
                        { name: 'CityName', value: req.body.CityName }
                    ]

                    try {
                        const result = await dataAccess.execute(`SP_City`, data);
                        if (result.rowsAffected == 1) {
                            if (!req.body.CityID) {
                                res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                            }
                            else {
                                res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });

                                //#region Insert Audit Log Data

                                var Description = "City data updated for city : " + req.body.CityName;
                                var auditlogdata = [
                                    { name: 'Query', value: 'Insert' },
                                    { name: 'CompanyID', value: (req.body.CompanyID) ? (req.body.CompanyID) : null },
                                    { name: 'ClientID', value: (req.body.ClientID) ? (req.body.ClientID) : null },
                                    { name: 'ModuleName', value: "City" },
                                    { name: 'UserID', value: null },
                                    { name: 'BookingID', value: null },
                                    { name: 'Operation', value: "Update" },
                                    { name: 'Description', value: Description },
                                    { name: 'JsonDescription', value: "" },
                                    { name: 'EntryByUserType', value: (req.body.EntryByUserType) ? (req.body.EntryByUserType) : null },
                                    { name: 'EntryByUserID', value: (req.body.EntryByUserID) ? (req.body.EntryByUserID) : null }
                                ]
                                const auditlogresult = await dataAccess.execute(`SP_AuditLog`, auditlogdata);

                                //#endregion
                            }
                        }
                        else {
                            res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                        }
                    } catch (error) {
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getCity = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'CityID', value: (req.body.CityID) ? (req.body.CityID) : null },
            { name: 'CountryID', value: (req.body.CountryID) ? (req.body.CountryID) : null },
            { name: 'StateID', value: (req.body.StateID) ? (req.body.StateID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_City`, data);
        if (result.recordset && result.recordset[0]) {
            const citydata = result.recordset;
            if (citydata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: citydata, error: null });
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

exports.removeCity = [async (req, res) => {
    try {
        if (!req.body.CityID) {
            res.json({ status: 0, message: "Please Enter CityID", data: null, error: null });
        }
        else {
            await Connection.connect();

            var CheckCityIDReferenceData = [
                { name: 'Query', value: 'CheckCityIDDataExists' },
                { name: 'CityID', value: req.body.CityID }
            ]

            const CityIDReferenceDataResult = await dataAccess.execute(`SP_City`, CheckCityIDReferenceData);
            if (CityIDReferenceDataResult.recordset && CityIDReferenceDataResult.recordset[0]) {
                const citycountdata = CityIDReferenceDataResult.recordset;
                if (citycountdata.length > 0) {
                    if (citycountdata[0].CityCount > 0) {
                        res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                    }
                    else {
                        var data = [
                            { name: 'Query', value: 'Delete' },
                            { name: 'CityID', value: req.body.CityID },
                            { name: 'IsDelete', value: true }
                        ]
                        const result = await dataAccess.execute(`SP_City`, data);
                        if (result.rowsAffected == 1) {

                            //#region Insert Audit Log Data

                            // var Description = "City data removed for city : " + req.body.CityName;
                            // var auditlogdata = [
                            //     { name: 'Query', value: 'Insert' },
                            //     { name: 'CompanyID', value: (req.body.CompanyID) ? (req.body.CompanyID) : null },
                            //     { name: 'ClientID', value: (req.body.ClientID) ? (req.body.ClientID) : null },
                            //     { name: 'ModuleName', value: "City" },
                            //     { name: 'UserID', value: null },
                            //     { name: 'BookingID', value: null },
                            //     { name: 'Operation', value: "Delete" },
                            //     { name: 'Description', value: Description },
                            //     { name: 'JsonDescription', value: "" },
                            //     { name: 'EntryByUserType', value: (req.body.EntryByUserType) ? (req.body.EntryByUserType) : null },
                            //     { name: 'EntryByUserID', value: (req.body.EntryByUserID) ? (req.body.EntryByUserID) : null }
                            // ]
                            // const auditlogresult = await dataAccess.execute(`SP_AuditLog`, auditlogdata);

                            //#endregion

                            res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
                        }
                        else {
                            res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                        }
                    }
                }
                else {
                    res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
                }
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }

            // var data = [
            //     { name: 'Query', value: 'Delete' },
            //     { name: 'CityID', value: req.body.CityID },
            //     { name: 'IsDelete', value: true }
            // ]
            // const result = await dataAccess.execute(`SP_City`, data);
            // if (result.rowsAffected == 1) {
            //     res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
            // }
            // else {
            //     res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            // }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];