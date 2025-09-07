import mongoose from 'mongoose'
const connectDB = async ()=>{
    return await mongoose.connect(process.env.DB_URI).then(res=>{
        console.log('connected DB');
    }
    ).catch(err=>{console.error('fail to connect this DB',err);
    })
    }
    export default connectDB
