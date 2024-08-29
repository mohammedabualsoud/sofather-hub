const mongoose = require("mongoose");

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectToDataBase;
