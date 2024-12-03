const mongoose = require('mongoose');

  const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Disable strict population checks
    mongoose.set("strictPopulate", false);
    
    // Log the host after the connection is successfully established
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    // Log the error if the connection fails
    console.error(`Mongo Error: ${err.message}`.red.bold);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;