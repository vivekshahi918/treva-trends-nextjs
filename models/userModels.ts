import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type:String,
        required: true,
    },
    deliveryaddresses: {
        type: Array,
        default: [],
        required: false,
    },

    isActive: {
        type: Boolean,
        default: true,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false,
    },

    },
{
    timestamps : true,
});
// //if model is already defined , use that model else create a new one

// let User = null
// if(mongoose.models['users']){
//     module.exports = mongoose.models['users'];
// }else{
//     module.exports = mongoose.model("users", userSchema);
// }

// export default User;
export default mongoose.models['users'] || mongoose.model("users", userSchema);