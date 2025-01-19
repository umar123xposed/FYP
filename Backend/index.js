const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS to allow requests from the frontend
app.use(cors());

// Route to handle image upload and prediction
app.post("/predict", upload.single("image"), (req, res) => {
    const imagePath = req.file.path;
    const command = `python prediction.py ${imagePath}`;
    console.log(`Executing: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return res.status(500).json({ error: "Error processing image." });
        }

        const outputLines = stdout.split("\n");
        const prediction = outputLines.find((line) =>
            line.startsWith("Prediction:")
        )?.replace("Prediction:", "").trim();
        const heatmapPath = outputLines.find((line) =>
            line.startsWith("Heatmap saved at:")
        )?.replace("Heatmap saved at:", "").trim();

        if (prediction && heatmapPath) {
            // Normalize the heatmap path
            const absoluteHeatmapPath = path.resolve(heatmapPath);
            const heatmapUrl = `heatmaps/${path.basename(absoluteHeatmapPath)}`;

            console.log(`Prediction: ${prediction}`);
            console.log(`Heatmap URL: ${heatmapUrl}`);
            return res.json({ result: prediction, heatmap_url: heatmapUrl });
        } else {
            return res.status(500).json({ error: "Error processing image." });
        }
    });
});

// Serve static files from the backend root folder
app.use("/heatmaps", express.static(path.join(__dirname)));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});