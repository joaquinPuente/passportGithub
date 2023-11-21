import mongoose from "mongoose";
export const URI= 'mongodb+srv://joaquinpuente:maypa1912@cluster0.pp8gbxz.mongodb.net/ecommerce';

export const init = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log('Database connected 😎');
    } catch (error) {
        console.log('Error to connect to database', error.message);
    }
    
}