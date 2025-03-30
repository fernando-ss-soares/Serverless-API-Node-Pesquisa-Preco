import mongoose from "mongoose";

const User = mongoose.model('User', {
    Name: String,
    Email: String,
    Password: String,
    Active: Boolean
});

export default User;