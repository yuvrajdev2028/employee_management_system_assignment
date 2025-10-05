const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet=require('helmet');
const cors=require('cors');

const dbConnect = require('./config/databaseConfig');

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

PORT = process.env.PORT||5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(cors({origin: 'https://ems-frontend-sable.vercel.app',credentials:true}))

app.use('/api/v1',userRoutes)
app.use('/api/v1',employeeRoutes)
app.use('/api/v1',departmentRoutes)
app.use('/api/v1',attendanceRoutes)

app.get("/",(req,res)=>{
    res.send("<h2>Server started...</h2>")
})

dbConnect();

app.listen(PORT,(err)=>{
    if(err) console.error(`Error occured while starting the server at port ${PORT}:`,err);
    else console.log(`Server listening to port ${PORT}`);
})
