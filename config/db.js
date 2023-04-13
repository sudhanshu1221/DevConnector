const mongoose =require('mongoose');
const config=require('config');
const db=config.get('mongoURI');

const connectDB = async () => {
    try{
        
await mongoose.connect(db);
     
    // await mongoose.connect(db,{ useNewUrlParser:true });
       
       console.log('MongodDb Connected...');
    }catch(err){
        console.log(err.message);
        //EXIT PROCESS WITH FAILURE
        process.exit(1);
    }


};

module.exports = connectDB;