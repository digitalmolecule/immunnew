import dotenv from 'dotenv'
import connectDB from './src/db/index.js'
import {server} from './app.js'


dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
  server.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running at the port ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("MONGO DB CONNECTION FAILED !!!",err);
})

