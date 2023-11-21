import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    first_name: String ,
    last_name: String ,
    email: {type:String, unique:true} ,
    age: Number,
    password: String ,
    user: String,
    provider: String,
},{timestamps:true});

export default mongoose.model('User', userSchema)