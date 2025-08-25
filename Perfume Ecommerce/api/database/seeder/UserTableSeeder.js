import SignUp from "../../models/SignUp.js";

class UserTableSeeder {
    static async run() {
        let UserData = {
            username: "Admin",
            password: "admin123",
            email: "admin@gmail.com",
            phone: "123456789",
            role: "admin",
        };

        let findUser = await SignUp.findOne({ email: UserData.email });
        if (!findUser) {
            let user = new SignUp(UserData);
            await user.save(); // Corrected from UserData.save() to user.save()
            console.log("Admin user created successfully");
        }
    }
}

export default UserTableSeeder;
