const jwt = require("jsonwebtoken");

async function getAuthToken(accessToken) {
  const verifyUser = await jwt.verify(
    accessToken,
    process.env.JWT_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        return err;
      } else {
        return decoded.id;
      }
    }
  );
  return verifyUser;
}

module.exports = getAuthToken;
