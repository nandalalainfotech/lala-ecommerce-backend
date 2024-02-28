import mongoose from "mongoose";

const AddressthSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    companyname: { type: String, required: false },
    country: { type: String, required: false },
    street: { type: String, required: false },
    appartment: { type: String, required: false },
    state: { type: String, required: false },
    town: { type: String, required: false },
    zip: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    label1: { type: String, required: false },
    checkedac: { type: String, required: false },
    // password: { type: String, required: false },
    anotheraddress: { type: String, required: false },
    firstnameS: { type: String, required: false },
    lastnameS: { type: String, required: false },
    companynameS: { type: String, required: false },
    countryS: { type: String, required: false },
    streetS: { type: String, required: false },
    appartmentS: { type: String, required: false },
    stateS: { type: String, required: false },
    townS: { type: String, required: false },
    zipS: { type: String, required: false },
    notes: { type: String, required: false },
    label2: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Addressthmodel = mongoose.model("Addresstheme", AddressthSchema);

export default Addressthmodel;
