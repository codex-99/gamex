const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tokens: [{
        token: {type: String, required: true}
    }]
})

userSchema.methods.generateAuthTokens = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()},"thisisMySecretKeyTheHouseMonk");
        this.tokens = this.tokens.concat({token})
        await this.save()
        return token
    }catch(err){
        console.log(err)
    }
}

const Users = new mongoose.model('User', userSchema )

module.exports = Users;