
// import User from '../models/User.js';
// import TokenVerify from '../middleware/TokenVerify.js';

// class LoginController {
//     constructor() {}

//     async login(req, res) {
//         let {email, password}= req.body;

//         //find user by email
//         let findData = await User.findOne({email: email});
//         if(!findData){
//             return res.status(400).json({emalError: 'Invalid email'});
//         }else{
//             let isMatch=await findData.comparePassword(password);
//             if(!isMatch){
//                 return res.status(400).json({passwordError: 'Invalid password'});
//             }else{
//                 let token = findData.generateToken();
//                 return res.json({token: token});
//             }
//         }
//     }

//     async tokenVerify(req, res){
//         let token = req.body.token;
//         let response = TokenVerify.verifyToken(token);
//         if(response){
//             return res.json({status: true});
//         }else{
//             return res.json({status: false});
//         }
//     }
// }

// export default LoginController;
