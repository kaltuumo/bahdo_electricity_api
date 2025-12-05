const House = require('../models/houseModels'); 
const Customer = require('../models/customerModels'); 
const { houseSignupSchema } = require('../middlewares/validator'); 

// Helper to generate unique customerNo
const generateCustomerNo = async () => {
  const lastHouse = await House.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;
  if (lastHouse && lastHouse.customerNo) {
    const numericPart = lastHouse.customerNo.replace('C', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }
  return `C${newNumber.toString().padStart(4, '0')}`;
};

// Helper to generate houseNo
const generateHouseNo = async () => {
  const lastHouse = await House.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;
  if (lastHouse && lastHouse.houseNo) {
    const numericPart = lastHouse.houseNo.replace('H', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }
  return `H${newNumber.toString().padStart(4, '0')}`;
};

// Helper to generate watchNo
const generateWatchNo = async () => {
  const lastHouse = await House.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;
  if (lastHouse && lastHouse.watchNo) {
    const numericPart = lastHouse.watchNo.replace('W', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }
  return `W${newNumber.toString().padStart(4, '0')}`;
};

// CREATE HOUSE
exports.createHouse = async (req, res) => {
  try {
    const {fullname, phone, zoneName, areaName, city } = req.body;

    if (! fullname|| ! phone|| !zoneName || !areaName || !city) {
      return res.status(400).json({ success: false, message: 'Please Fill In The Blank' });
    }

    const customerNo = await generateCustomerNo();
    const houseNo = await generateHouseNo();
    const watchNo = await generateWatchNo();

    const newHouse = new House({
      customerNo,
      fullname,
      phone,
      zoneName,
      areaName,
      city,
      houseNo,
      watchNo
    });

    const savedHouse = await newHouse.save();

    res.status(201).json({
      success: true,
      message: 'House created successfully',
      result: savedHouse
    });

  } catch (err) {
    console.error('Error creating house:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
// GET ALL HOUSES
exports.getHouse = async (req, res) => {
  try {
    const houses = await House.find();

    const formattedHouses = houses.map((house) => {
      const createdAtObj = new Date(house.createdAt);
      const updatedAtObj = new Date(house.updatedAt);

      const createdDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(createdAtObj);
      const createdTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Mogadishu',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(createdAtObj);

      const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
      const updateTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Mogadishu',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(updatedAtObj);

      return {
        _id: house._id,
        customerNo: house.customerNo,
        fullname: house.fullname,
        phone: house.phone,
        zoneName: house.zoneName,
        areaName: house.areaName,
        city: house.city,
        houseNo: house.houseNo,
        watchNo: house.watchNo,
        createdDate,
        createdTime,
        updateDate,
        updateTime,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Houses fetched successfully',
      data: formattedHouses,
    });

  } catch (err) {
    console.error('❌ Error fetching houses:', err);
    res.status(500).json({ success: false, message: 'Error fetching houses' });
  }
};

// UPDATE HOUSE
exports.updateHouse = async (req, res) => {
  const houseId = req.params.id;
  const { fullname, phone, zone, area, city } = req.body;

  try {
    const existingHouse = await House.findById(houseId);
    if (!existingHouse) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    if (fullname) existingHouse.fullname = fullname;
    if (phone) existingHouse.phone = phone;
    if (zone) existingHouse.zone = zone;
    if (area) existingHouse.area = area;
    if (city) existingHouse.city = city;

    const updatedHouse = await existingHouse.save();

    const updatedAtObj = new Date(updatedHouse.updatedAt);
    const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(updatedAtObj);

    res.status(200).json({
      success: true,
      message: 'House updated successfully',
      result: {
        _id: updatedHouse._id,
        customerNo: updatedHouse.customerNo,
        fullname: updatedHouse.fullname,
        phone: updatedHouse.phone,
        zoneName: updatedHouse.zoneName,
        areaName: updatedHouse.areaName,
        city: updatedHouse.city,
        houseNo: updatedHouse.houseNo,
        watchNo: updatedHouse.watchNo,
        updateDate,
        updateTime,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating house' });
  }
};

// DELETE HOUSE
exports.deleteHouse = async (req, res) => {
  const houseId = req.params.id;

  try {
    const result = await House.findByIdAndDelete(houseId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.status(200).json({ success: true, message: 'House deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting house' });
  }
};
