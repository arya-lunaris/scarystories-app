import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            message: "Please enter a valid email.",
            validator: (email) => validator.isEmail(email)
        },
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    next()
})

userSchema.methods.isPasswordValid = function (plaintextPassword) {
    return bcrypt.compareSync(plaintextPassword, this.password)
}

    userSchema.plugin(mongooseUniqueValidator)

    export default mongoose.model('User', userSchema);