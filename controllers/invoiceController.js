
const Invoice = require('../models/invoiceModels');
const { invoiceSchema, invoiceSignupSchema } = require('../middlewares/validator');

// ✅ Create Invoice
exports.createInvoice = async (req, res) => {
  const {
    fullname, phone, zone, area, beforeRead, afterRead,
    kwhUsed, discount, month, status
  } = req.body;

  try {
    // Validate input
    const { error } = invoiceSignupSchema.validate({
      fullname, phone, zone, area, beforeRead, afterRead,
      kwhUsed, discount, month, status
    });
    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }

    // Auto-generate billNo
    let lastInvoice = await Invoice.findOne().sort({ billNo: -1 });
    let billNo = 1;
    if (lastInvoice && !isNaN(lastInvoice.billNo)) {
      billNo = lastInvoice.billNo + 1;
    }

    // Auto-generate houseNo
    let houseNo = 'H001';
    if (lastInvoice && lastInvoice.houseNo) {
      const lastHouse = parseInt(lastInvoice.houseNo.replace(/\D/g, ''));
      houseNo = 'H' + String(lastHouse + 1).padStart(3, '0');
    }

    // Auto-generate watchNo
    let watchNo = 'W001';
    if (lastInvoice && lastInvoice.watchNo) {
      const lastWatch = parseInt(lastInvoice.watchNo.replace(/\D/g, ''));
      watchNo = 'W' + String(lastWatch + 1).padStart(3, '0');
    }
// ✅ Calculate total before discount
let totalAmount = Number(((afterRead - beforeRead) * kwhUsed).toFixed(2));

// ✅ Required after discount (this is what customer should pay)
let requiredAmount = totalAmount;
if (discount && discount > 0) {
  requiredAmount = Number((totalAmount - discount).toFixed(2));
}

const paidAmount = 0;
const remainingAmount = requiredAmount - paidAmount;


    const newInvoice = new Invoice({
      billNo,
      fullname,
      phone,
      zone,
      area,
      beforeRead,
      afterRead,
      kwhUsed,
      discount,
      month,
      status,
      houseNo,
      watchNo,
      totalAmount,
      required: requiredAmount,
      paid: paidAmount,
      remaining: remainingAmount
    });

    const savedInvoice = await newInvoice.save();

    // Format Dates
    const createdAtObj = new Date(savedInvoice.createdAt);
    const updatedAtObj = new Date(savedInvoice.updatedAt);
    const createdDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(createdAtObj);
    const createdTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(createdAtObj);
    const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(updatedAtObj);

    res.status(201).json({
      success: true,
      message: "Invoice has been created",
      result: {
        _id: savedInvoice._id,
        billNo: savedInvoice.billNo,
        fullname: savedInvoice.fullname,
        phone: savedInvoice.phone,
        zone: savedInvoice.zone,
        area: savedInvoice.area,
        beforeRead: savedInvoice.beforeRead,
        afterRead: savedInvoice.afterRead,
        kwhUsed: savedInvoice.kwhUsed,
        discount: savedInvoice.discount,
        month: savedInvoice.month,
        status: savedInvoice.status,
        houseNo: savedInvoice.houseNo,
        watchNo: savedInvoice.watchNo,
        totalAmount: savedInvoice.totalAmount,
        required: savedInvoice.required,
        paid: savedInvoice.paid,
        remaining: savedInvoice.remaining,
        createdDate,
        createdTime,
        updateDate,
        updateTime
      }
    });

  } catch (err) {
    console.error("❌ Create error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Invoices
exports.getInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find();

    const formattedInvoices = invoices.map(invoice => {
      const createdAtObj = new Date(invoice.createdAt);
      const updatedAtObj = new Date(invoice.updatedAt);
      const createdDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(createdAtObj);
      const createdTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(createdAtObj);
      const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
      const updateTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(updatedAtObj);

      const totalAmount = invoice.totalAmount || Number(((invoice.afterRead - invoice.beforeRead) * invoice.kwhUsed).toFixed(2));

      return {
        _id: invoice._id,
        billNo: invoice.billNo,
        fullname: invoice.fullname,
        phone: invoice.phone,
        zone: invoice.zone,
        area: invoice.area,
        beforeRead: invoice.beforeRead,
        afterRead: invoice.afterRead,
        kwhUsed: invoice.kwhUsed,
        discount: invoice.discount,
        month: invoice.month,
        status: invoice.status,
        houseNo: invoice.houseNo,
        watchNo: invoice.watchNo,
        required: invoice.required,
        paid: invoice.paid,
        remaining: invoice.remaining,
        createdDate,
        createdTime,
        updateDate,
        updateTime,
        totalAmount
      };
    });

    res.status(200).json({
      success: true,
      message: 'Invoice fetched successfully',
      data: formattedInvoices,
    });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ success: false, message: 'Error fetching invoices' });
  }
};

// ✅ Update Invoice
exports.updateInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  const { fullname, phone, zone, area, beforeRead, afterRead, kwhUsed, discount, month, status } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    let totalAmount = invoice.totalAmount;
   if ((beforeRead !== undefined && afterRead !== undefined && kwhUsed !== undefined) || discount !== undefined) {
  totalAmount = Number(((afterRead - beforeRead) * kwhUsed).toFixed(2));
    if (discount && discount > 0) {
    totalAmount = Number((totalAmount - discount).toFixed(2));
  }
}

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        ...(fullname !== undefined && { fullname }),
        ...(phone !== undefined && { phone }),
        ...(zone !== undefined && { zone }),
        ...(area !== undefined && { area }),
        ...(beforeRead !== undefined && { beforeRead: Number(beforeRead) }),
        ...(afterRead !== undefined && { afterRead: Number(afterRead) }),
        ...(kwhUsed !== undefined && { kwhUsed: Number(kwhUsed) }),
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(month !== undefined && { month }),
        ...(status !== undefined && { status }),
        ...(totalAmount !== undefined && {
          totalAmount,
          required: totalAmount,
          remaining: totalAmount - (invoice.paid || 0)
        })
      },
      { new: true }
    );

    const updatedAtObj = new Date(updatedInvoice.updatedAt);
    const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(updatedAtObj);

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      result: {
        _id: updatedInvoice._id,
        fullname: updatedInvoice.fullname,
        phone: updatedInvoice.phone,
        zone: updatedInvoice.zone,
        area: updatedInvoice.area,
        beforeRead: updatedInvoice.beforeRead,
        afterRead: updatedInvoice.afterRead,
        kwhUsed: updatedInvoice.kwhUsed,
        discount: updatedInvoice.discount,
        month: updatedInvoice.month,
        status: updatedInvoice.status,
        totalAmount: updatedInvoice.totalAmount,
        required: updatedInvoice.required,
        paid: updatedInvoice.paid,
        remaining: updatedInvoice.remaining,
        houseNo: updatedInvoice.houseNo,
        watchNo: updatedInvoice.watchNo,
        updateDate,
        updateTime,
      },
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: "Error updating Invoice" });
  }
};

exports.updateInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  const {
    fullname,
    phone,
    zone,
    area,
    beforeRead,
    afterRead,
    kwhUsed,
    discount,
    month,
    status,
    required,
    paid,
  } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    // ✅ Calculate total amount
    let totalAmount = Number(((afterRead - beforeRead) * kwhUsed).toFixed(2));
    let requiredAmount = totalAmount;

    if (discount && discount > 0) {
      requiredAmount = Number((totalAmount - discount).toFixed(2));
    }

    // ✅ If paid provided, calculate remaining
    const paidAmount = paid !== undefined ? Number(paid) : invoice.paid || 0;
    const remainingAmount = requiredAmount - paidAmount;

    // ✅ Determine status based on remaining
    let newStatus = status;
    if (!status) {
      if (remainingAmount <= 0) newStatus = "Paid";
      else if (paidAmount > 0 && remainingAmount > 0) newStatus = "Pending";
      else newStatus = "Unpaid";
    }

    // ✅ Update invoice in DB
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        fullname,
        phone,
        zone,
        area,
        beforeRead: Number(beforeRead),
        afterRead: Number(afterRead),
        kwhUsed: Number(kwhUsed),
        discount: Number(discount),
        month,
        status: newStatus,
        totalAmount,
        required: requiredAmount,
        paid: paidAmount,
        remaining: remainingAmount,
      },
      { new: true }
    );

    // ✅ Format update timestamps
    const updatedAtObj = new Date(updatedInvoice.updatedAt);
    const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(updatedAtObj);

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully ✅",
      result: {
        _id: updatedInvoice._id,
        billNo: updatedInvoice.billNo,
        fullname: updatedInvoice.fullname,
        phone: updatedInvoice.phone,
        zone: updatedInvoice.zone,
        area: updatedInvoice.area,
        beforeRead: updatedInvoice.beforeRead,
        afterRead: updatedInvoice.afterRead,
        kwhUsed: updatedInvoice.kwhUsed,
        discount: updatedInvoice.discount,
        month: updatedInvoice.month,
        status: updatedInvoice.status,
        totalAmount: updatedInvoice.totalAmount,
        required: updatedInvoice.required,
        paid: updatedInvoice.paid,
        remaining: updatedInvoice.remaining,
        houseNo: updatedInvoice.houseNo,
        watchNo: updatedInvoice.watchNo,
        updateDate,
        updateTime,
      },
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: "Error updating Invoice" });
  }
};

// ✅ Update Invoice Status (Payment)
exports.updateInvoiceStatus = async (req, res) => {
  const invoiceId = req.params.id;
  const { amountPaid } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const totalAmount = invoice.totalAmount || 0;
    const currentPaid = invoice.paid || 0;
    const newAmountPaid = currentPaid + (amountPaid || 0);

    if (invoice.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Lacagtaan horey ayaa loo bixiyay, mar dambe ma la bixin karo',
        pendingAmount: 0
      });
    }

    if (newAmountPaid >= totalAmount) {
      invoice.paid = totalAmount;
      invoice.remaining = 0;
      invoice.status = 'Paid';
    } else if (newAmountPaid > 0 && newAmountPaid < totalAmount) {
      invoice.paid = newAmountPaid;
      invoice.remaining = totalAmount - newAmountPaid;
      invoice.status = 'Pending';
    } else {
      invoice.paid = 0;
      invoice.remaining = totalAmount;
      invoice.status = 'Unpaid';
    }

    await invoice.save();

    const updatedAtObj = new Date(invoice.updatedAt);
    const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
    const updateTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Mogadishu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(updatedAtObj);

    return res.status(200).json({
      success: true,
      message: `Status updated to ${invoice.status}`,
      result: {
        _id: invoice._id,
        paid: invoice.paid,
        remaining: invoice.remaining,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        updateDate,
        updateTime
      }
    });

  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Delete Invoice
exports.deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const result = await Invoice.findByIdAndDelete(invoiceId);
    if (!result) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ success: false, message: 'Error deleting invoice' });
  }
};

// ✅ Get Pending Invoices
exports.getPendingInvoices = async (req, res) => {
  try {
    const pendingInvoices = await Invoice.find({ remaining: { $gt: 0 } });

    const formattedInvoices = pendingInvoices.map(invoice => ({
      _id: invoice._id,
      billNo: invoice.billNo,
      fullname: invoice.fullname,
      phone: invoice.phone,
      zone: invoice.zone,
      area: invoice.area,
      beforeRead: invoice.beforeRead,
      afterRead: invoice.afterRead,
      kwhUsed: invoice.kwhUsed,
      discount: invoice.discount,
      month: invoice.month,
      status: invoice.status,
      houseNo: invoice.houseNo,
      watchNo: invoice.watchNo,
      required: invoice.required,
      paid: invoice.paid,
      remaining: invoice.remaining,
    }));

    res.status(200).json({
      success: true,
      message: 'Pending Invoice fetched successfully',
      data: formattedInvoices,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error fetching pending Invoice' });
  }
};
// ✅ Get Only Unpaid Invoices
exports.getUnpaidInvoices = async (req, res) => {
  try {
    const unpaidInvoices = await Invoice.find({
      status: 'Unpaid'   // ✅ Kaliya kuwa Unpaid ah
    });

    const formattedInvoices = unpaidInvoices.map(invoice => ({
      _id: invoice._id,
      billNo: invoice.billNo,
      fullname: invoice.fullname,
      phone: invoice.phone,
      zone: invoice.zone,
      area: invoice.area,
      beforeRead: invoice.beforeRead,
      afterRead: invoice.afterRead,
      kwhUsed: invoice.kwhUsed,
      discount: invoice.discount,
      month: invoice.month,
      status: invoice.status,
      houseNo: invoice.houseNo,
      watchNo: invoice.watchNo,
      required: invoice.required,
      paid: invoice.paid,
      remaining: invoice.remaining,
    }));

    res.status(200).json({
      success: true,
      message: 'Unpaid Invoices fetched successfully',
      data: formattedInvoices,
    });
  } catch (err) {
    console.error('❌ Error fetching unpaid invoices:', err);
    res.status(500).json({ success: false, message: 'Error fetching unpaid invoices' });
  }
};


exports.getPaidInvoices = async (req, res) => {
  try {
    const paidInvoices = await Invoice.find({
      status: 'Paid'   // ✅ Kaliya kuwa Unpaid ah
    });

    const formattedInvoices = paidInvoices.map(invoice => ({
      _id: invoice._id,
      billNo: invoice.billNo,
      fullname: invoice.fullname,
      phone: invoice.phone,
      zone: invoice.zone,
      area: invoice.area,
      beforeRead: invoice.beforeRead,
      afterRead: invoice.afterRead,
      kwhUsed: invoice.kwhUsed,
      discount: invoice.discount,
      month: invoice.month,
      status: invoice.status,
      houseNo: invoice.houseNo,
      watchNo: invoice.watchNo,
      required: invoice.required,
      paid: invoice.paid,
      remaining: invoice.remaining,
    }));

    res.status(200).json({
      success: true,
      message: 'Paid Invoices fetched successfully',
      data: formattedInvoices,
    });
  } catch (err) {
    console.error('❌ Error fetching unpaid invoices:', err);
    res.status(500).json({ success: false, message: 'Error fetching unpaid invoices' });
  }
};

exports.deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const result = await Invoice.findByIdAndDelete(invoiceId);
    if (!result) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ success: false, message: 'Error deleting invoice' });
  }
};

