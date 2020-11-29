const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!room || !username) {
    return {
      error: "Username and room are required!",
    };
  }

  // find je bolji od filter jer ako nadje element ne ide dalje traziti a filter ide
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    // find index vraca -1 ako nije nadjen  taj user
    return id === user.id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0]; // splice mice elemente iz arraya prema indexu, vraca array
  }
};

const getUser = (id) => {
  return users.find((user) => {
    // vraca undefined ako ne nadje
    return id === user.id;
  });
};

const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room === room.trim().toLowerCase();
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
