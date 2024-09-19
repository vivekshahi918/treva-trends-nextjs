import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
},
    {
        timestamps: true,
    });
// //if model is already defined , use that model else create a new one

// let User = null
// if(mongoose.models['users']){
//     module.exports = mongoose.models['users'];
// }else{
//     module.exports = mongoose.model("users", userSchema);
// }

// export default User;
export default mongoose.models.categories || mongoose.model("categories", categorySchema);