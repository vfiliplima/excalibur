const serializeRole = (role) => {
  if (!role) {
    return null;
  }

  return {
    role_id: role.id,
    role_name: role.name,
  };
};

module.exports = serializeRole;
