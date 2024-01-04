const userRepo = require("../repositories/userRepo");

const handleLogin = async (userName, password, res) => {
  const user = await userRepo.getUser(userName);

  console.log(user);

  if (user.password !== password) {
    console.log("Wrong password");
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.status(200).json({ isAdmin: user.isAdmin });
};

const handleGetAllUsers = async (req, res) => {
  const users = await userRepo.getAllUsers();
  res.status(200).json(users);
};

module.exports = { handleLogin, handleGetAllUsers };
