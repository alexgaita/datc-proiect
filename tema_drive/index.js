const createReadStream = require('fs').createReadStream;
const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

// Set up a file upload middleware (using multer)
// const storage = multer.memoryStorage();
const upload = multer({ dest: './public/data/uploads/' })


// Define a route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {

    console.log(req.file)

    const fileMetadata = {
        name: req.file.originalname,
    };

    const media = {
        mimeType: req.file.mimetype,
        body: createReadStream(req.file.path),
    };

    drive.files.create(
        {
            resource: fileMetadata,
            media: media,
            fields: 'id',
        },
        (err, file) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).send('Error uploading file.');
            } else {
                console.log('File uploaded with ID:', file.data.id);
                res.status(200).send('File uploaded successfully.');
            }
        }
    );
});

app.get('/files',async (req,res)=>{
    const response = await drive.files.list({
        fields: 'files(id, name)',
    });

    res.status(200).send(response.data.files)
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
