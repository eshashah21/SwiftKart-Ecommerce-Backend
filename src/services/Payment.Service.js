const razorpay = require("../config/razorpayClient");
const orderService = require("../services/Order.Service");
const nodemailer = require("nodemailer"); 

const createPaymentLink = async (orderId) => {
    try {
        const order = await orderService.findOrderById(orderId);

        // Base price calculations
        const totalPrice = parseFloat(order.totalPrice);
        const discount = parseFloat(order.discount) || 0;
        const discountedPrice = totalPrice - discount;

        // GST Calculation (18%)
        const gstAmount = discountedPrice * 0.18;

        // Delivery Charge (₹40 if total is less than ₹700)
        const deliveryCharge = discountedPrice < 700 ? 40 : 0;

        // Final Amount Calculation
        const finalAmount = discountedPrice + gstAmount + deliveryCharge;

        // Round final amount to ensure it is a whole number in paise
        const amountInPaise = Math.round(finalAmount * 100);  // Convert to paise and round to nearest whole number

        const paymentLinkRequest = {
            amount: amountInPaise,  // Amount in paise (whole number)
            currency: "INR",
            customer: {
                name: order.user.firstName + " " + order.user.lastName,
                contact: order.user.mobile,
                email: order.user.email,
            },
            notify: {
                sms: false,
                email: false,
            },
            reminder_enable: true,
            callback_url: `http://localhost:3000/payment/${orderId}`,
            callback_method: "get",
        };

        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
        const paymentLinkId = paymentLink.id;
        const payment_Link_url = paymentLink.short_url;

        const resData = {
            paymentLinkId,
            payment_Link_url,
        };

        return resData;
    } catch (error) {
        // console.error("Error while creating payment link:", error);
        throw new Error(error.message || "An error occurred while creating the payment link.");
    }
};


const updatePaymentInfo = async (reqData) => {
    const paymentId = reqData.payment_id;
    const orderId = reqData.order_id;

    try {
        const order = await orderService.findOrderById(orderId);
        const payment = await razorpay.payments.fetch(paymentId);

        console.log("Payment Status:", payment.status);

        if (payment.status === "captured") {
            order.paymentDetails.paymentId = paymentId;
            order.paymentDetails.status = "COMPLETED";
            order.orderStatus = "PLACED";
            await order.save();

            // Calculate delivery date (7 days after order date)
            const orderDate = new Date(order.orderDate);
            const deliveryDate = new Date(orderDate.setDate(orderDate.getDate() + 7));

            // Debugging recipient email
            console.log("Sending confirmation email to:", order.user.email);

            // Prepare email content
            const emailSubject = "Your Order Has Been Placed Successfully!";
            const emailBody = `
                <h3>Dear ${order.user.firstName} ${order.user.lastName},</h3>
                <p>We are pleased to inform you that your order has been successfully placed and will be delivered to you by <strong>${deliveryDate.toDateString()}</strong>.</p>
                <p>Thank you for shopping with us! If you have any questions or need assistance, feel free to contact us.</p>
                <p>Best regards,<br>SwiftKart Team</p>
            `;

            // Nodemailer setup
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'your@gmail.com', 
                    pass: '1234 1234 1234 1234', 
                },
            });

            const mailOptions = {
                from: "your@gmail.com",
                to: order.user.email,
                subject: emailSubject,
                html: emailBody
            };

            // Send email and log the result
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Email sending error:", err);
                } else {
                    console.log("Email sent successfully:", info.response);
                }
            });
        }

        return { message: "Your order is placed and email sent successfully!", success: true };

    } catch (error) {
        console.error("Error during payment update and email sending:", error);
        throw new Error(error.message || "An error occurred while processing your order.");
    }
};

module.exports = {
    createPaymentLink,
    updatePaymentInfo
}