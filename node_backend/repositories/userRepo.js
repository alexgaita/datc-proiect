
const {userTableClient} = require("../config/db");

const getUser = async (id) => {
  const response = await userTableClient.getEntity(id, "User");
  return response;
}

const getAllUsers = async () => {
  const userReponse = userTableClient.listEntities();

  const users = [];

  for await (const user of userReponse) {
    users.push({
        id: user.partitionKey,
        name: user.name,
        isAdmin: user.isAdmin,
    });
  }

  return users;
}

module.exports = {getUser,getAllUsers}

