const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { FamilyInfo } = require("../models/familyModel");
const { FamilyInfoValidation } = require("../validations/familyValidation");

const getAllFamily = async (req, res) => {
  // var employee = {};
  // {path: 'projects', populate: {path: 'portals'}}
  Employee.findById(req.params.id)
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "familyInfo",
      // populate: {
      //   path: "state",
      //   model: "State",
      //   populate: {
      //     path: "country",
      //     model: "Country"
      //   }
      // }
    })
    // .select(" -role -position -department")
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      // console.log(filteredCompany);
      res.send(employee);
    });
};

// create a city
const createFamily = async (req, res) => {
  Joi.validate(req.body, FamilyInfoValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      Employee.findById(req.params.id, function (err, employee) {
        if (err) {
          console.log(err);
          res.send("err");
        } else {
          let newFamilyInfo;

          newFamilyInfo = {
            Name: req.body.Name,
            Relationship: req.body.Relationship,
            DOB: req.body.DOB,
            Occupation: req.body.Occupation,
            parentMobile: req.body.parentMobile,
          };

          FamilyInfo.create(newFamilyInfo, function (err, familyInfo) {
            if (err) {
              console.log(err);
              res.send("error");
            } else {
              employee.familyInfo.push(familyInfo);
              employee.save(function (err, data) {
                if (err) {
                  console.log(err);
                  res.send("err");
                } else {
                  res.send(familyInfo);
                }
              });
            }
          });
        }
      });
    }
  });
};

// find and update the city
const updateFamily = async (req, res) => {
  Joi.validate(req.body, FamilyInfoValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newFamilyInfo;

      newFamilyInfo = {
        Name: req.body.Name,
        Relationship: req.body.Relationship,
        DOB: req.body.DOB,
        Occupation: req.body.Occupation,
        parentMobile: req.body.parentMobile,
      };

      FamilyInfo.findByIdAndUpdate(
        req.params.id,
        newFamilyInfo,
        function (err, familyInfo) {
          if (err) {
            res.send("error");
          } else {
            res.send(newFamilyInfo);
          }
        }
      );
    }
  });
};

// const deleteFamily = async (req, res) => {
//   Employee.findById({ _id: req.params.id }, function (err, employee) {
//     if (err) {
//       res.send("error");
//       console.log(err);
//     } else {
//       FamilyInfo.findByIdAndRemove(
//         { _id: req.params.id2 },
//         function (err, familyInfo) {
//           if (!err) {
//             Employee.update(
//               { _id: req.params.id },
//               { $pull: { familyInfo: req.params.id2 } },
//               function (err, numberAffected) {
//                 res.send(familyInfo);
//               }
//             );
//           } else {
//             console.log(err);
//             res.send("error");
//           }
//         }
//       );
//     }
//   });
// };

const deleteFamily = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      const error = new Error("Employee not found");
      error.status = 404;
      throw error;
    }

    const familyInfo = await FamilyInfo.findByIdAndRemove(req.params.id2);

    if (!familyInfo) {
      const error = new Error("Family member not found");
      error.status = 404;
      throw error;
    }

    await Employee.update(
      { _id: req.params.id },
      { $pull: { familyInfo: req.params.id2 } }
    );

    res.status(200).send(familyInfo);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFamily,
  createFamily,
  updateFamily,
  deleteFamily,
};
