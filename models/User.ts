import { Schema, model, models } from "mongoose";

const schema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!']
    },
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    image: {
        type: String
    }
});

const User = models.User || model('User', schema);

export default User;