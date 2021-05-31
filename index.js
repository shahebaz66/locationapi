const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-shahebaz:admin123@shahebaz.r8yb8.mongodb.net/mounty?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => { console.log("db connected"); });

const Schema = mongoose.Schema;
const mySchema = new Schema({

    name: String,
    mobile: { type: String, unique: true },
    email: String,
    address: {
        street: String,
        locality: String,
        city: String,
        state: String,
        pincode: String
    },
    location: {
        type: { type: String },
        coordinates: [Number]
    }
}, { timestamps: true });

mySchema.index({ location: "2dsphere" })
const User = mongoose.model('User', mySchema);
module.exports = User