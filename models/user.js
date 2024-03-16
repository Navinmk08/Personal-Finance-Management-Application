const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash the password before saving
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        user.password = hashedPassword;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
