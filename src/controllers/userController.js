const User = require("../models/User");

const updateUser = async (req, res) => {
  const userId = req.user.id; // Assuming you get the user ID from the authenticated user

  // Extract the fields you want to update from the request body
  const { username, email, fullname, phone, gender, date_of_birth } = req.body;

  // Validasi bahwa setidaknya satu field harus diisi untuk melakukan update
  if (!username && !email && !fullname && !phone && !gender && !date_of_birth) {
    return res.status(400).json({ message: 'At least one field must be filled in for update.' });
  }

  try {
    // Cek apakah user dengan ID tersebut ada
    console.log(User);
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user data
    await existingUser.update({
      username: username || existingUser.username,
      email: email || existingUser.email,
      fullname: fullname || existingUser.fullname,
      phone: phone || existingUser.phone,
      gender: gender || existingUser.gender,
      date_of_birth: date_of_birth || existingUser.date_of_birth,
    });

    res.json({ message: 'User data updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  updateUser,
  getAllUser,
  getUserById,
  deleteUser,
};
