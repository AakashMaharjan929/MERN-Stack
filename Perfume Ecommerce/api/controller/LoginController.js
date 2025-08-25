import bcrypt from 'bcrypt';
import SignUp from '../models/SignUp.js';

class LoginController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await SignUp.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let passwordMatch = false;

      try {
        // Try bcrypt comparison first
        passwordMatch = await bcrypt.compare(password, user.password);
      } catch (err) {
        // Ignore bcrypt errors
      }

      // Fallback to plain-text comparison for legacy accounts
      if (!passwordMatch && user.password === password) {
        passwordMatch = true;
      }

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      req.session.username = user.username;

      res.status(200).json({ Login: true, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ Login: false });
    }
  }
}

export default LoginController;
