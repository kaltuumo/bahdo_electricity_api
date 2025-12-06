const Zone = require('../models/zoneModels'); 
const { zoneSchema } = require('../middlewares/validator'); 
const {zoneSignupSchema} = require('../middlewares/validator');




exports.createZone = async (req, res) => {
    let { zoneName, description} = req.body;

    try {
        // Validate the input data
        const { error } = zoneSignupSchema.validate({ zoneName, description });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const newZone = new Zone({
            zoneName,
            description,
            
            // required: requiredAmount,  // Store as number
            // paid: paidAmount,          // Store as number
            // discount: discountAmount,  // Store as number
            // remaining: remainingAmount, // Store as number
            // levelElectric
            
        });

        const savedZone = await newZone.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedZone.createdAt);
        const updatedAtObj = new Date(savedZone.updatedAt);

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
            message: "Customer has been created",
            result: {
                _id: savedZone._id,
                zoneName: savedZone.zoneName,
                description: savedZone.description,
               
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




exports.getZone = async (req, res) => {
    try {
        const zones = await Zone.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedZones = zones.map(Zone => {
            const createdAtObj = new Date(Zone.createdAt);
            const updatedAtObj = new Date(Zone.updatedAt);

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
                _id: Zone._id,
                zoneName: Zone.zoneName,
                description: Zone.description,
            
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Zone fetched successfully',
            data: formattedZones,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Customer' });
    }

    
}





exports.updateZone = async (req, res) => {
    const { zoneName, description} = req.body;
    const zoneId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingZone = await Zone.findById(zoneId);
        if (!existingZone) {
            return res.status(404).json({ success: false, message: 'Zone not found' });
        }

        // Update admin details
        if (zoneName) existingZone.zoneName = zoneName;
        if (description) existingZone.description = description;

        
        // Save the updated admin
        const updatedZone = await existingZone.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedZone.updatedAt);

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
            message: 'Zone updated successfully',
            result: {
                _id: updatedZone._id,
                zoneName: updatedZone.zoneName,
                description: updatedZone.description,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Zone' });
    }
};

exports.deleteZone = async (req, res) => {
    const zoneId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await Zone.findByIdAndDelete(zoneId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Zone not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Zone deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }

};