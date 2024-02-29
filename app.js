const express = require("express")
const collection = require("./mongo")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",cors(),(req,res)=>{

})

app.post("/",async(req,res)=>{

    // thêm biến khai báo vào document ở đây
    const {servo1} = req.body
    const {servo2} = req.body
    const {servo3} = req.body
    const {servo4} = req.body
    const {mode} = req.body
    const {control} = req.body
    

    const data={
        // thêm khai báo vào document ở đây
        servo1:servo1,
        servo2:servo2,
        servo3:servo3,
        servo4:servo4,
        mode:mode,
        control:control,
    }

    await collection.insertMany([data])


})

app.listen(8000,()=>{
    console.log("port connected")
})


