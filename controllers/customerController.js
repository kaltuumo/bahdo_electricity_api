const Customer = require('../models/customerModels'); 
const { customerSchema } = require('../middlewares/validator'); 
const {customerSignupSchema} = require('../middlewares/validator');

exports.createCustomer = async (req, res) => {
  let { fullname, phone, gender, statusPerson, damiin, damiinPhone } = req.body;

  try {
    // ✅ Validate input
    const { error } = customerSignupSchema.validate({ fullname, phone, gender, statusPerson, damiin, damiinPhone });
    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }

    // ✅ Find the last customer
    const lastCustomer = await Customer.findOne().sort({ createdAt: -1 }).exec();

    let newNumber = 1; // default starting number

    if (lastCustomer && lastCustomer.customerNo) {
      const numericPart = lastCustomer.customerNo.replace('C', '');
      const lastNumber = parseInt(numericPart, 10);

      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }

    // ✅ Format new customer number (C0001, C0002, etc.)
    const customerNo = `C${newNumber.toString().padStart(4, '0')}`;

    // ✅ Create new customer
    const newCustomer = new Customer({
      customerNo,
      fullname,
      phone,
      gender,
      statusPerson,
      damiin,
      damiinPhone
    });

    const savedCustomer = await newCustomer.save();

    // ✅ Format timestamps
    const createdAtObj = new Date(savedCustomer.createdAt);
    const updatedAtObj = new Date(savedCustomer.updatedAt);

    const createdDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Mogadishu',
    }).format(createdAtObj);

    const createdTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(createdAtObj);

    const updateDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Mogadishu',
    }).format(updatedAtObj);

    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(updatedAtObj);

    // ✅ Return response
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      result: {
        _id: savedCustomer._id,
        customerNo: savedCustomer.customerNo,
        fullname: savedCustomer.fullname,
        phone: savedCustomer.phone,
        gender: savedCustomer.gender,
        statusPerson: savedCustomer.statusPerson,
        damiin: savedCustomer.damiin,
        damiinPhone: savedCustomer.damiinPhone,
        createdDate,
        createdTime,
        updateDate,
        updateTime,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.getCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();  // Fetch all admins
        
        // Format the date and time for each admin
        const formattedCustomers = customers.map(Customer => {
            const createdAtObj = new Date(Customer.createdAt);
            const updatedAtObj = new Date(Customer.updatedAt);

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
              _id: Customer._id,
              customerNo: Customer.customerNo,
              fullname: Customer.fullname,
              gender: Customer.gender,
              statusPerson: Customer.statusPerson,
              damiin: Customer.damiin,
              damiinPhone: Customer.damiinPhone,
                // required: Customer.required,
                // paid: Customer.paid,
                // discount: Customer.discount,
                // remaining: Customer.remaining,
                // levelElectric: Customer.levelElectric,
                phone: Customer.phone,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Customer fetched successfully',
            data: formattedCustomers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Customer' });
    }

    
};


exports.updateCustomer = async (req, res) => {
    const { fullname, phone, gender, statusPerson, damiin, damiinPhone } = req.body;
    const customerId = req.params.id;  // Get the admin ID from the route parameter

    try {
        // Find the admin by ID
        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Update admin details
        if (fullname) existingCustomer.fullname = fullname;
        if (gender) existingCustomer.gender = gender;
        if (phone) existingCustomer.phone = phone;
        if (statusPerson) existingCustomer.statusPerson = statusPerson;
        if (damiin) existingCustomer.damiin = damiin;
        if (damiinPhone) existingCustomer.damiinPhone = damiinPhone;
      
        // Save the updated admin
        const updatedCustomer = await existingCustomer.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedCustomer.updatedAt);

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
            message: 'Student updated successfully',
            result: {
                _id: updatedCustomer._id,
                customerNo: updatedCustomer.customerNo, // ✅ correct field name
                fullname: updatedCustomer.fullname,
                gender: updatedCustomer.gender,
                phone: updatedCustomer.phone,
                statusPerson: updatedCustomer.statusPerson,
                damiin: updatedCustomer.damiin,
                damiinPhone: updatedCustomer.damiinPhone,
                // required: updatedCustomer.required,
                // paid: updatedCustomer.paid,
                // phone: updatedCustomer.phone,
                // remaining: updatedCustomer.remaining,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Customer' });
    }
};



exports.deleteCustomer = async (req, res) => {
    const customerId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the admin by ID and delete it
        const result = await Customer.findByIdAndDelete(customerId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }
};



