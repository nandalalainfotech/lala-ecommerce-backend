import express from "express";
import expressAsyncHandler from "express-async-handler";
import Addressthmodel from "../Models/Addressmodelth.js";
import bcrypt from "bcryptjs";
import CustomerDetailsModel from "../Models/CustomerDetailsModel.js";
const Addressrouterth = express.Router();
Addressrouterth.post(
  "/billaddress",
  expressAsyncHandler(async (req, res) => {
    const customerDetail = new Addressthmodel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      companyname: req.body.companyname,
      country: req.body.country,
      street: req.body.street,
      appartment: req.body.appartment,
      state: req.body.state,
      town: req.body.town,
      zip: req.body.zip,
      phone: req.body.phone,
      email: req.body.email,
      label1: req.body.label1,
      checkedac: req.body.checkedac,
      anotheraddress: req.body.check,
      firstnameS: req.body.firstnameS,
      lastnameS: req.body.lastnameS,
      companynameS: req.body.companynameS,
      countryS: req.body.countryS,
      streetS: req.body.streetS,
      appartmentS: req.body.appartmentS,
      stateS: req.body.stateS,
      townS: req.body.townS,
      zipS: req.body.zipS,
      notes: req.body.notes,
      label2: req.body.label2,
    });

    const CustoAddress = await customerDetail.save();
    res.send({
      message: "CusAddress details Added",
      CustomerAddress: CustoAddress,
    });
    if (req.body.checkedac === true) {
      const customerdetailData = new CustomerDetailsModel({
        emailorphone: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdProfile = await customerdetailData.save();

      res.send({ message: "Customer Added", category: createdProfile });
    }
  })
);

Addressrouterth.get(
  "/thaddresslist",
  expressAsyncHandler(async (req, res) => {
    const themecheckoutaddress = await Addressthmodel.find().sort({
      createdAt: -1,
    });

    if (themecheckoutaddress) {
      res.send(themecheckoutaddress);
    } else {
      res.status(404).send({ message: "theme checkout address Not Found" });
    }
  })
);
export default Addressrouterth;
