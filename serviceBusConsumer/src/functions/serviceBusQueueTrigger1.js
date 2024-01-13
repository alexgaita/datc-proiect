const { app } = require("@azure/functions");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ambrosiaproiect@gmail.com",
    pass: "mklp eisx lgqy rszw",
  },
});

app.serviceBusQueue("serviceBusQueueTrigger1", {
  connection: "gaitaservicebus_SERVICEBUS",
  queueName: "ambrozia_queue",
  handler: (message, context) => {
    context.log("Service bus queue function processed message:", message);

    const { body, email } = message;

    var mailOptions = {
      from: "ambrosiaproiect@gmail.com",
      to: email,
      subject: "Sending Email using Node.js",
      text: `That was easy! ${body}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
});
