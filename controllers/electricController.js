const Electric = require('../models/electricModels'); 
const { electricSignupSchema } = require('../middlewares/validator'); 

//-----------------------------------------------------
// Helper 1: Generate unique customer number
//-----------------------------------------------------
const generateCustomerNo = async () => {
  const lastElectric = await Electric.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;

  if (lastElectric && lastElectric.customerNo) {
    const numericPart = lastElectric.customerNo.replace('C', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }

  return `C${newNumber.toString().padStart(4, '0')}`;
};

//-----------------------------------------------------
// Helper 2: Generate unique house number
//-----------------------------------------------------
const generateHouseNo = async () => {
  const lastElectric = await Electric.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;

  if (lastElectric && lastElectric.houseNo) {
    const numericPart = lastElectric.houseNo.replace('H', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }

  return `H${newNumber.toString().padStart(4, '0')}`;
};

//-----------------------------------------------------
// Helper 3: Generate unique meter number
//-----------------------------------------------------
const generateMeterNo = async () => {
  const lastElectric = await Electric.findOne().sort({ createdAt: -1 }).exec();
  let newNumber = 1;

  if (lastElectric && lastElectric.meterNo) {
    const numericPart = lastElectric.meterNo.replace('M', '');
    const lastNumber = parseInt(numericPart, 10);
    if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
  }

  return `M${newNumber.toString().padStart(4, '0')}`;
};

//-----------------------------------------------------
// CREATE ELECTRIC CUSTOMER
//-----------------------------------------------------
exports.createElectric = async (req, res) => {
  let { electricType, statusElectric } = req.body;

  try {
    // Validate
    const { error } = electricSignupSchema.validate({ electricType, statusElectric });
    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }

    if (!electricType || !statusElectric) {
      return res.status(400).json({ success: false, message: 'Please Fill In The Blank' });
    }

    // Auto-generate fields
    const customerNo = await generateCustomerNo();
    const houseNo = await generateHouseNo();
    const meterNo = await generateMeterNo();

    const newElectric = new Electric({
      customerNo,
      electricType,
      statusElectric,
      houseNo,
      meterNo
    });

    const savedElectric = await newElectric.save();

    //-----------------------------------------------------
    // Format times for Somalia Time UTC+3
    //-----------------------------------------------------
    const createdAtObj = new Date(savedElectric.createdAt);
    const updatedAtObj = new Date(savedElectric.updatedAt);

    const createdDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Mogadishu'
    }).format(createdAtObj);

    const createdTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(createdAtObj);

    const updateDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Mogadishu'
    }).format(updatedAtObj);

    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(updatedAtObj);

    //-----------------------------------------------------
    // Response
    //-----------------------------------------------------
    res.status(201).json({
      success: true,
      message: "Electric  has been created",
      result: {
        _id: savedElectric._id,
        customerNo: savedElectric.customerNo,
        electricType: savedElectric.electricType,
        statusElectric: savedElectric.statusElectric,
        houseNo: savedElectric.houseNo,
        meterNo: savedElectric.meterNo,
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

exports.getElectric = async (req, res) => {
  try {
    const electrics = await Electric.find();

    const formattedElectrics = electrics.map((electric) => {
      const createdAtObj = new Date(electric.createdAt);
      const updatedAtObj = new Date(electric.updatedAt);

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
        _id: electric._id,
        customerNo: electric.customerNo,
        electricType: electric.electricType,
        statusElectric: electric.statusElectric,
        meterNo: electric.meterNo,
        houseNo: electric.houseNo,
  
        createdDate,
        createdTime,
        updateDate,
        updateTime,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Electric fetched successfully',
      data: formattedElectrics,
    });

  } catch (err) {
    console.error('❌ Error fetching houses:', err);
    res.status(500).json({ success: false, message: 'Error fetching houses' });
  }
};
