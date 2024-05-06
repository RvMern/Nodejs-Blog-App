const mongoose = require("mongoose");

const dbConnect = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_ATLAS_URL)
    .then((data)=>{
        console.log(`Database Has Been Connected Successfully on ${data.connection.host}`);
    });
    }
    catch(err){
        console.log(err.message);
    }
};

dbConnect();