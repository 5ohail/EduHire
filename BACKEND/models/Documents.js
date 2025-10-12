const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    email: {type:String, required : true},
    documentType: {type: String,required: true},
    pathname: {type: String,required: true}
})

const documentModel  = mongoose.model("Documents",documentSchema);
module.exports = documentModel;