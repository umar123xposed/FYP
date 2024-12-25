const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Set up multer for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
            console.log('Uploads folder created.');
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Route to handle image upload and run prediction
app.post('/predict', upload.single('image'), (req, res) => {
    const imagePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log(`Received Image Path: ${imagePath}`);

    // Run Python prediction script
    exec(`python prediction.py ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running prediction: ${stderr}`);
            return res.status(500).json({ error: 'Prediction script failed.' });
        }
        console.log(`Prediction Output: ${stdout}`);
        return res.status(200).json({ result: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
