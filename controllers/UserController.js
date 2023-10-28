const User = require("../models/User");

const searchEmail = async (req, res) => {

    const searchQuery = req.query.q;

    try {
        const users = await User.find({ email: { $regex: searchQuery, $options: 'i' } }).limit(5);
        const emailSuggestions = users.map((user) => user.email);

        res.json(emailSuggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching for emails.' });
    }
}


module.exports = { searchEmail }