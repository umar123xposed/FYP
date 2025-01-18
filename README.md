# Automatic Detection of Breast Cancer

This project is an application designed for the automatic detection of breast cancer using advanced machine learning techniques and a modern user interface. It provides users with an intuitive platform to upload histopathological images and receive predictions about whether the tissue is benign or malignant.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Frontend](#frontend)
- [Backend](#backend)
- [Breast Cancer Detection Model](#breast-cancer-detection-model)
- [How It Works](#how-it-works)
- [Installation and Usage](#installation-and-usage)
- [Project Structure](#project-structure)
- [Acknowledgements](#acknowledgements)

---

## Overview

This project utilizes Convolutional Neural Networks (CNN) optimized with a Genetic Algorithm (GA) for accurate detection of breast cancer. It employs a React-based frontend for a visually appealing and user-friendly interface and a Node.js backend for processing predictions and handling requests.

---

## Features

1. **Patient Information Management**:
   - Input and manage details like patient name, age, and gender.
2. **Image Upload**:
   - Upload histopathological images for analysis.
3. **Real-Time Progress Updates**:
   - Display real-time training and prediction steps with a progress bar.
4. **Prediction Results**:
   - Classifies images as "Malignant" or "Benign" with results displayed dynamically.
5. **Heatmap Generation**:
   - Shows the analyzed heatmap of the uploaded image for better interpretability.

---

## Frontend

- **Framework**: React.js (using Material-UI for styling)
- **Highlights**:
  - Professional, polished UI with animations and frosted-glass effects.
  - Patient and analysis sections.
  - Real-time feedback and result visualization.

---

## Backend

- **Framework**: Node.js
- **Libraries**:
  - `express` for server handling.
  - `multer` for file upload management.
  - Python integration for model execution.
- **Functionality**:
  - Accepts image uploads.
  - Processes the image through the breast cancer detection model.
  - Generates a heatmap and sends the results back to the frontend.

---

## Breast Cancer Detection Model

- **Dataset**: BreakHis dataset of histopathological images.
- **Model**: Convolutional Neural Network (CNN) optimized with a Genetic Algorithm (GA).
- **Files**:
  - `train.py`: Trains the model on the dataset.
  - `test.py`: Tests the model to evaluate accuracy.
  - `prediction.py`: Accepts an image, runs it through the model, and generates predictions.
- **Accuracy**: Achieves 95% accuracy in classifying images as benign or malignant.

---

## How It Works

1. **Image Upload**:
   - Users upload a histopathological image via the frontend.
2. **Backend Processing**:
   - The uploaded image is sent to the backend.
   - The backend runs the `prediction.py` script.
   - The script returns the classification result and a heatmap image.
3. **Results Display**:
   - The frontend shows the result ("Malignant" or "Benign") and displays the heatmap alongside the original image.

---

## Installation and Usage

### Prerequisites

- Node.js
- Python (with required libraries)
- Anaconda

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   ```
2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
4. **Run Backend Server**:
   ```bash
   node index.js
   ```
5. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
6. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.

---

## Project Structure

```
project-root
├── backend
│   ├── index.js
│   ├── uploads
│   │   └── (uploaded files)
│   ├── model
│   │   └── (model files)
│   └── prediction.py
│   └── train.py
│   └── test.py
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── public
│       └── (static assets)
└── README.md
```

---

## Acknowledgements

- BreakHis Dataset for providing histopathological images.
- Material-UI for simplifying UI design.
- OpenAI for the model optimization inspiration.

Feel free to contribute, report issues, or suggest enhancements. Happy coding!
