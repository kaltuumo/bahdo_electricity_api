const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendMail");
const { hmacProcess, doHash } = require("../utils/hashing");
const User = require("../models/userModels");
const { userSignupSchema } = require("../middlewares/validator");
const {userLoginSchema} = require("../middlewares/validator");
const { doHashValidation } = require("../utils/hashing");

exports.signup = async (req, res) => {
    const { fullname, email, password, phone, role , status} = req.body;

    try {
        const { error } = userSignupSchema.validate({ fullname, email, password, phone, role, status });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }
// Generate new B-code
const lastUser = await User.findOne().sort({ createdAt: -1 });

let newCode = "B001";

if (lastUser && lastUser.userCode) {
    let lastNumber = parseInt(lastUser.userCode.replace("B", ""), 10);
    let nextNumber = lastNumber + 1;

    // Format 001, 002, 003...
    newCode = "B" + String(nextNumber).padStart(3, '0');
}

        // Check if admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'User already exists!' });
        }

        // Hash the password
        const hashedPassword = await doHash(password, 12);

        // Create new admin
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phone,
            role,
            status,
            userCode: newCode,   // <-- Waa IN lagu daro!
        });

        // Save admin to the database
        const savedUser = await newUser.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedUser.createdAt);
        const updatedAtObj = new Date(savedUser.updatedAt);

        const createdDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(createdAtObj); // "YYYY-MM-DD"

        const createdTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(createdAtObj); // "HH:MM:SS"

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(updatedAtObj); // "HH:MM:SS"

        // Send response back with the new admin details including creation and update time
        res.status(201).json({
            success: true,
            message: "Your Account Has been Created",
            result: {
                _id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                phone: savedUser.phone,
                role: savedUser.role,
                status: savedUser.status,
                userCode: savedUser.userCode,
                createdDate,
                createdTime,
                updateDate,
                updateTime
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    const { userCode, password } = req.body;

    try {
        // VALIDATION (bedel email → userCode)
        const { error } = userLoginSchema.validate({ userCode, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        // FIND USER USING userCode
        const existingUser = await User.findOne({ userCode }).select('+password');

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid userCode or password!",
            });
        }

        // CHECK PASSWORD
        const isMatch = await doHashValidation(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid userCode or password!",
            });
        }

        // JWT TOKEN WITH userCode
        const token = jwt.sign(
            {
                userId: existingUser._id,
                fullname: existingUser.fullname,
                phone: existingUser.phone,
                userCode: existingUser.userCode,   // ✔ KU DAR
                role: existingUser.role,
                status: existingUser.status,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                fullname: existingUser.fullname,
                phone: existingUser.phone,
                userCode: existingUser.userCode,
                role: existingUser.role,
                status: existingUser.status,
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.logout = async (req, res) => {
	res
		.clearCookie('Authorization')
		.status(200)
		.json({ success: true, message: 'logged out successfully' });
};


exports.getUser = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedUsers = users.map(user => {
            const createdAtObj = new Date(user.createdAt);
            const updatedAtObj = new Date(user.updatedAt);

            // Format createdAt date and time
            const createdDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(createdAtObj); // "YYYY-MM-DD"

            const createdTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(createdAtObj); // "HH:MM:SS"

            // Format updatedAt date and time
            const updateDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(updatedAtObj); // "YYYY-MM-DD"

            const updateTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(updatedAtObj); // "HH:MM:SS"

            return {

                userId: user._id,
                fullname: user.fullname,
                email: user.email,
                password: user.password,
                phone: user.phone,
                role: user.role,
                status: user.status,
                userCode: user.userCode,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: formattedUsers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Users' });
    }
};


exports.updateUser = async (req, res) => {
    const { fullname, email, password, phone , role, status} = req.body;
    const userId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update admin details
        if (fullname) existingUser.fullname = fullname;
        if (email) existingUser.email = email;
        if (password) existingUser.password = await doHash(password, 12);
        if (phone) existingUser.phone = phone;
        if (role) existingUser.role = role;
        if (status) existingUser.status = status;

        // Save the updated admin
        const updatedUser = await existingUser.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedUser.updatedAt);

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(updatedAtObj); // "HH:MM:SS"

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            result: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                status: updatedUser.status,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error Updating User' });
    }
};


exports.deleteUser = async (req, res) => {
    const userId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }
};



