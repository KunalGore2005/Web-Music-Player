const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch(err){
        console.error('Error connecting to the database', err);
    }
}

module.exports = connectDB;