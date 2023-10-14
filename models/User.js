const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    profilePhoto: String,
    sharedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SharedNote' }],
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

// Hash the user's password before saving
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});


const User = mongoose.model('User', userSchema);
module.exports = User;
