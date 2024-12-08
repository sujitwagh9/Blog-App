import mongoose,{ Schema } from "mongoose";


const articleSchema= new Schema({
    title:{
        type: String,
        required:true,
        unique:true,
        minlength: 5
    },
    content:{
        type:String,
        required:true,
        minlength:10
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tags: [{
        type: String,
        trim:true
    }],
    publishedDate:{
        type:Date,
        default:Date.now,
    },
    isPublished:{
        type: Boolean,
        default:false
    },
    views:{
        type:Number,
        default:0
    },
},
{
    timestamps:true,
})

const Article=mongoose.model("Article",articleSchema);

export { Article }