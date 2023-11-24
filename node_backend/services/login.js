
const userRepo = require('../repositories/userRepo');

const handleLogin = async (userName, password,res) => {
    
    const user = await userRepo.getUser(userName);

    if (user.password !== password) {
        res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ isAdmin: user.isAdmin  });
}

module.exports = { handleLogin }