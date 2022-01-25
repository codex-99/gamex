const mongoose = require('mongoose');

const DB = "mongodb://localhost:27017/gamex";

mongoose.connect(DB,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('MongoDB Connection established')
}).catch((e)=>{
    console.log("Error Connecting...")
})