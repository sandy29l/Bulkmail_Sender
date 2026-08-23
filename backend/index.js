const express = require("express")
const cors = require("cors")

const app = express();

app.use(express.json())
app.use(cors())

const nodemailer = require("nodemailer");
let userTransporter = null;
let loggedInEmail = null;

// const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "sandyborn2904@gmail.com",
//         pass: "bfaj eely xlxr jgbg" "ieuu alvv scus hpqu",
//     },
// })
app.post("/login", async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmail,
                pass: password
            }
        });

        // Verify Gmail credentials
        await transporter.verify();

        userTransporter = transporter;
        loggedInEmail = gmail;

        console.log("Gmail authentication successful");

        res.json({
            success: true,
            message: "Login successful"
        });
        // res.send(true)

    } catch (error) {
        // console.log("Gmail authentication failed:", error.message);

        // // res.status(401).json({
        // //     success: false,
        // //     message: "Invalid Gmail or App Password"
        // // });
        // res.json({
        //     success: false,
        //     message: "Login failed"
        // });
        console.log("Gmail authentication failed:");
        console.log(error);

        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});


app.post("/send", function (req, res) {

    for (let i = 0; i < req.body.emaillist.length; i++) {
        userTransporter.sendMail(
            {
                from: loggedInEmail,
                to: req.body.emaillist[i].A,
                subject: req.body.subject,
                text: req.body.message
            },
            function (error, info) {
                if (error) {
                    console.log(error)
                    res.send(false);
                }
                else {
                    console.log("info")
                    res.send(true);
                }
            }
        )
    }


})

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});