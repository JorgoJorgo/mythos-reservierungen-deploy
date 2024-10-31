const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Hashed password: ${hashedPassword}`);
  } catch (err) {
    console.error(err);
  }
};

// Ersetze 'your_password' durch das tatsächliche Passwort, das du hashen möchtest
hashPassword('your_password');


//$2b$10$INto/u/1qMaBfHozPDB/Qu96Fv4/Imx88cZenRcwsRRM.i3BWGqiq
//$2b$10$4myUAE2L392NqN5MfRF4begel3XY6h8Mnzuil0WpwIDKYtd73kDTm