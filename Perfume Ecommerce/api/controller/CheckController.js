
class CheckController {
    async check(req, res) {
        // Check if user is logged in
        if (req.session.username) {
            res.json({ valid: true, username: req.session.username, email: req.session.email, phone: req.session.phone});
        } else {
            res.json({ valid: false });
        }
    }

    async logout(req, res) {
        // Clear the session
        req.session.destroy();
        res.json({ message: "Logged out successfully" });
    }
}

export default CheckController;