import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema= new Schema({
    username:{
        type: String,
        unique:true,
        required:[true,"username required!"],
        trim:true,
    },
    email:{
        type: String,
        required:[true,"email required!"],
        unique:true,
    },
    password:{
        type: String,
        required:true,
        minlength:[6,"Password must be at least 6 characters long"],
    },
    role:{
        type:String,
        enum:['author','admin','reader'],
        default:'reader',
    },
    refreshTokens: [String],
},
{
    timestamps:true,
}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password= await bcrypt.hash(this.password,10); 
    next()
})




userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password);
}




const User=mongoose.model("User",userSchema);

export { User }