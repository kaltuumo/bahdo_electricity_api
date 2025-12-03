const Area = require('../models/areaModels'); 
const { areaSchema } = require('../middlewares/validator'); 
const {areaSignupSchema} = require('../middlewares/validator');




exports.createArea = async (req, res) => {
    let { areaName, description, zoneName} = req.body;

    try {
        // Validate the input data
        const { error } = areaSignupSchema.validate({ areaName, description,zoneName });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const newArea = new Area({
            areaName,
            description,
            zoneName
            
            // required: requiredAmount,  // Store as number
            // paid: paidAmount,          // Store as number
            // discount: discountAmount,  // Store as number
            // remaining: remainingAmount, // Store as number
            // levelElectric
            
        });

        const savedArea = await newArea.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedArea.createdAt);
        const updatedAtObj = new Date(savedArea.updatedAt);

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

        res.status(201).json({
            success: true,
            message: "Area has been created",
            result: {
                _id: savedArea._id,
                areaName: savedArea.areaName,
                description: savedArea.description,
                zoneName: savedArea.zoneName,
               
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

exports.getArea = async (req, res) => {
    try {
        const areas = await Area.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedAreas = areas.map(Area => {
            const createdAtObj = new Date(Area.createdAt);
            const updatedAtObj = new Date(Area.updatedAt);

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
                _id: Area._id,
                areaName: Area.areaName,
                description: Area.description,
                zoneName: Area.zoneName,
            
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Area fetched successfully',
            data: formattedAreas,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Customer' });
    }

    
}


exports.updateArea = async (req, res) => {
    const {areaName, zoneName, description} = req.body;
    const areaId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingArea = await Area.findById(areaId);
        if (!existingArea) {
            return res.status(404).json({ success: false, message: 'Area not found' });
        }

        // Update admin details
        if (areaName) existingArea.areaName = areaName;
        if (zoneName) existingArea.zoneName = zoneName;
        if (description) existingArea.description = description;

        
        // Save the updated admin
        const updatedArea = await existingArea.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedArea.updatedAt);

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
            message: 'Area updated successfully',
            result: {
                _id: updatedArea._id,
                areaName: updatedArea.areaName,
                zoneName: updatedArea.zoneName,
                description: updatedArea.description,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Area' });
    }
};

exports.deleteArea = async (req, res) => {
    const areaId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await Area.findByIdAndDelete(areaId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Area not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Area deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }

};