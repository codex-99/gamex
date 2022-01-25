const express = require('express');
const mongoose = require('mongoose');

require('./db/conn');
const Orders = require("./model/orderSchema")
const Products = require("./model/productSchema")
const Users = require("./model/userSchema")
const bodyParser = require('body-parser')

const port = 3000;
const app = express();
app.use(bodyParser.json());

var max_order = 0;

// Create user data
app.post('/signup', async(req, res) => {
    const {name,age,email,password} = req.body;
    if(!name || !age || !email || !password){
        return res.status(400).json({message: "Empty field"})
    }

    try{
        const userExist = await Users.findOne({email});
        if(userExist){
           return res.json({message: "Email ID already exists"})
        }
        const userCount = await Users.count();
        const userId = `U${userCount+1}`

        const user = new Users({userId,name,age,email,password});

        const token = await user.generateAuthTokens();
        console.log("Token Generated");

        const userSave = await user.save();
        if(userSave){
            res.status(200).json({message: "User saved successfully"})
            console.log(userSave)
        }
        

    }catch(e){
        res.json({message: "Error"})
    }

})

//Place Order
app.post('/order',async(req, res) => {
    const {email, productName} = req.body
    if(!email || !productName){
        res.status(400).json({message: "Empty Field"})
    }
    try{
        const user = await Users.findOne({email})
        const product = await Products.findOne({productName})

        
        if(!user || !product){
            res.status(400).json("Invalid Info")
        }
        
        const orderId = `O${max_order+1}`;
        console.log(`OrderId: ${orderId}`)
        
        const order = new Orders({orderId: orderId, userId: user.userId, productId: product.productId})
        const orderSave = await order.save()

        if(orderSave){
            max_order++;
            res.status(200).json({message: "Order placed successfully"})
            console.log(orderSave)
        }

    }catch(e){
        res.json({message: "Error"})
    }
})

//Read user's order

app.get('/view-orders/:userId',async(req,res)=>{
    
    var number_of_records = req.body.number_of_records
    const userId = req.params.userId
    if(!userId || !number_of_records){
        return res.json({message:"User details not found"})
    }
    try{
        
        const order = await Orders.find({userId})
        if(!order){
            return res.send({message:"Data not found"})
        }else{
            console.log(order)
        }
        var display = []
        var message = "Success"
        if(number_of_records>order.length){
            number_of_records = order.length
            message = "The entered record exceeds the total number of records"
        }
        for(let i = 0; i < number_of_records; i++){
            display.push(order[i])
        }

        res.send({message: message,data: display})


    }catch(e){
        res.json({message: "Error"})
    }
})


//Update user data
app.patch('/update/:id', async(req, res)=>{
    try{
        const userId = req.params.id
        const user = await Users.findOne({userId})
        const userUpdate = await Users.findByIdAndUpdate(user._id, req.body, {
            new: true
        })
        res.send(userUpdate)

    }catch(e){
        res.json({message: "Error"})
        console.log(e)
    }
})

//Delete Orders
app.delete('/remove/:id', async(req,res)=>{
    const orderId = req.params.id;
    try{
        const order = await Orders.deleteOne({orderId});
        if(order.deletedCount === 0){
            return res.json({message: 'Record not found'})
        }
        res.json({message: 'Record deleted'})
    }catch(e){
        res.json({message: "Error"})
    }
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});