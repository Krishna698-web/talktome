const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`mongo connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error message: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;