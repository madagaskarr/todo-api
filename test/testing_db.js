const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server')


module.exports.connect = async () => {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    const mongooseOptions = {
        useNewUrlParse: true,
        useUnifiedTopology: true,
        poolSize: 10
    }
    await mongoose.connect(uri, mongooseOptions);
}

module.exports.clean = async () => {
    await mongoose.connection.dropDatabase();
}

module.exports.close = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}