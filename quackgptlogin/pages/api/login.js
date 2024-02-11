import connect from "../../lib/mongodb";
import User from '../../model/schema'

connect()

export default async function handler(req,res){
    const {username, password}=req.body
    const user = await User.findOne({username,password})
    if(!user){
        return res.json({status:'Not able to find user'})
    }
    else{
        res.redirect('/home');
    }
}