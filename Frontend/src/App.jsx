import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  TextField,
  Grid,
  Paper,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const Input = styled("input")({
  display: "none",
});

// Styled Paper with transparency and blur effect
const TransparentPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
  backdropFilter: "blur(10px)", // Frosted glass effect
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
}));

const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainingStepIndex, setTrainingStepIndex] = useState(0);
  const [showStep, setShowStep] = useState(true);
  const [progress, setProgress] = useState(0);

  const trainingStepsArray = [
    "Extracting features...",
    "Preprocessing image...",
    "Analyzing texture...",
    "Running classification...",
    "Generating results...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setShowStep(false);
        setTimeout(() => {
          setTrainingStepIndex((prevIndex) =>
            prevIndex === trainingStepsArray.length - 1 ? 0 : prevIndex + 1
          );
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 100 / trainingStepsArray.length
          );
          setShowStep(true);
        }, 500); // Delay for fade-out effect
      }, 2000); // Duration for each step (2 seconds)
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction("");
    setHeatmap(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an image!");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.result);
      setHeatmap(`http://localhost:3000/${data.heatmap_url}`); // Backend should return the heatmap URL
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to backend. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPrediction("");
    setHeatmap(null);
    setProgress(0);
    setTrainingStepIndex(0);
  };

  return (
    <Container
      maxWidth="md"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "url('/path/to/your/background.jpg') center/cover no-repeat",
      }}
    >
      <TransparentPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Automatic Detection of Breast Cancer
        </Typography>
        <Grid container spacing={3}>
          {/* Patient Information Section */}
          <Grid item xs={12} sm={6}>
            <TransparentPaper elevation={2}>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <TextField
                label="Patient Name"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </TransparentPaper>
          </Grid>

          {/* Texture Analysis Section */}
          <Grid item xs={12} sm={6}>
            <TransparentPaper elevation={2} style={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Texture Analysis
              </Typography>
              {file ? (
                <Box display="flex" justifyContent="center" gap={2}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded"
                    style={{ maxWidth: "45%", borderRadius: "5px" }}
                  />
                  {heatmap && (
                    <img
                      src={heatmap}
                      alt="Heatmap"
                      style={{ maxWidth: "45%", borderRadius: "5px" }}
                    />
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No image uploaded
                </Typography>
              )}
              <label htmlFor="file-input">
                <Input
                  accept="image/*"
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  style={{ marginTop: "10px" }}
                >
                  Load Image
                </Button>
              </label>
            </TransparentPaper>
          </Grid>

          {/* Progress Section */}
          <Grid item xs={12}>
            <TransparentPaper elevation={2}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Box>
                {loading ? (
                  <>
                    <Typography variant="body1" gutterBottom>
                      {trainingStepsArray[trainingStepIndex]}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Upload an image to see progress.
                  </Typography>
                )}
              </Box>
            </TransparentPaper>
          </Grid>

          {/* Prediction Results Section */}
          <Grid item xs={12}>
            <TransparentPaper elevation={2}>
              <Typography variant="h6" gutterBottom>
                Prediction Results
              </Typography>
              {prediction ? (
                <Typography
                  variant="h5"
                  style={{
                    color: prediction === "Malignant" ? "#d32f2f" : "#388e3c",
                  }}
                >
                  {prediction}
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No results available.
                </Typography>
              )}
            </TransparentPaper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginRight: "10px" }}
            >
              Predict
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </TransparentPaper>
    </Container>
  );
};

export default App;
