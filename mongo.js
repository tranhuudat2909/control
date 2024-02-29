const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://huudat:Nobita299@atlascluster.lnkfdwu.mongodb.net/ROBOT")
.then(()=>{
    console.log("connected");
})
.catch(()=>{
    console.log("failed");   
})

const newSchema=new mongoose.Schema({

    // thêm giá trị định nghĩa ở đây, Khai báo các biến muốn thêm vào document
    servo1:{
        type:Number,
        required:true
    },
    servo2:{
        type:Number,
        required:true
    },
    servo3:{
        type:Number,
        required:true
    },
    servo4:{
        type:Number,
        required:true
    },
    mode:{
        type:String,
        required:true
    },
    control:{
        type:String,
        required:true
    },

})

const collection = mongoose.model("collection",newSchema)

module.exports=collection
