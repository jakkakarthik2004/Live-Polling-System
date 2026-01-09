const mongoose = require('mongoose');
const { Poll } = require('./models/Poll');
const connectDB = require('./config/db');
require('dotenv').config();

const resetPolls = async () => {
    await connectDB();
    console.log("Connected to DB, resetting active polls...");
    
    const res = await Poll.updateMany(
        { isActive: true }, 
        { $set: { isActive: false } }
    );
    
    console.log(`Reset ${res.modifiedCount} active polls.`);
    process.exit();
};

resetPolls();
