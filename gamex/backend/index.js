/*

INSTRUCTIONS FOR EXECUTION:

Use POSTMAN for execution.

POST Requests:
1. /signup for new users {name, age,email ,password } as body
2. /orders for placing new order {email, productName} as body

GET Request
1. /view-orders to view past orders. Pass :userId as url parameter and number of records as body

PATCH Request
1. /update to update user data. Pass :userId as url parameter and required data to change as body.

DELETE Request
1. /remove to delete orders. Pass :orderId as url parameter

*/

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('./db/conn');
const auth = require('./middleware/auth');
const Orders = require("./model/orderSchema")
const Products = require("./model/productSchema")
const Users = require("./model/userSchema")
const bodyParser = require('body-parser')

const port = 3000;
const app = express();
app.use(bodyParser.json());

var max_order = 0;

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT, OPTIONS"
    )
    next()
})

// Create user data
app.post('/signup', async(req, res, next) => {
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
            res.status(200).json({
                message: "User saved successfully",
                token: userSave.tokens[0]
            })
            console.log(userSave)
        }
        

    }catch(e){
        res.json({message: "Error"})
    }

})

//Place Order
app.post('/order',auth,async(req, res, next) => {
    const {email, productName} = req.body;
    console.log(`Email: ${email} and Product Name: ${productName}`)
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
        
        const order = new Orders({orderId: orderId, userId: user.userId, productId: product.productId, productName: productName})
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

app.get('/view-orders/:email',auth,async(req,res, next)=>{
    
    var number_of_records = 10
    // var number_of_records = req.body.number_of_records
    const email = req.params.email
    if(!email || !number_of_records){
        return res.json({message:"User details not found"})
    }
    try{
        const user = await Users.findOne({ email})
        const userId = user.userId
        const userData = {email: user.email, userId: user.userId}
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

        res.send(display)
        // res.send({message: message,orders: display})


    }catch(e){
        console.log(e)
        res.json({message: "Error"})
    }
})

//Read products
app.get('/products',async(req,res, next)=>{
    try{
        const product = await Products.find();
        // console.log(product)
        res.send(product)
    }catch(e){
        res.json({message: "Error"})
        console.log(e)
    }
})

//check Login
app.post('/login',async(req, res, next)=>{
    try{
        const user = await Users.findOne({email: req.body.email});
        if(!user){
            return res.status(401).json({
                message: "User Not Found"
            })
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        // console.log(result)
        if(!result){
            return res.json({message: "Login Unsuccessful"})
        }
        const token = await user.generateAuthTokens();
        res.json({
            message: "User Login Successfully",
            token: token,
            userId: user.userId
        })
    }catch(e){
        console.log(e)
    }
})

//Update user data
app.patch('/update/:id',auth, async(req, res, next)=>{
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
app.delete('/remove/:id', auth,async(req,res, next)=>{
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