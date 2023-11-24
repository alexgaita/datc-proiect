
const {userTableClient} = require("../config/db");

const getUser = async (id) => {
  const response = await userTableClient.getEntity(id, "User");
  return response;
}

module.exports = {getUser}

