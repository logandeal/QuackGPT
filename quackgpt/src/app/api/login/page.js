import connect from "../../../lib/mongodb";
import User from '../../../model/schema';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

connect()

export default async function handler(req,res){
    console.log(req.body)
    const {username, password}=req.body
    const user = await User.findOne({username,password})
    if(!user){
        return res.json({status:'Not able to find user'})
    }
    else{
        res.redirect('/home');
    }
}