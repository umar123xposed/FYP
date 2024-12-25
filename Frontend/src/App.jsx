import React, { useState } from "react";

const App = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (!file) {
            alert("Please upload an image!");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:3000/predict", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.result) {
                setLoading(false);
                setPrediction(data.result);
            } else {
                alert("Error: No prediction result received");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>AI-Powered Breast Cancer Detection</h1>
                <p style={styles.headerSubtitle}>
                    Using advanced AI to analyze histopathological images for accurate diagnosis upto 98.9%.
                </p>
            </header>
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Upload Your Image</h2>
                <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                <button onClick={handleSubmit} style={styles.button}>
                    Predict
                </button>
                {loading ? (
                    <p style={styles.loadingText}>Analyzing... Please wait.</p>
                ) : (
                    <p style={styles.prediction}>{prediction}</p>
                )}
            </div>
            <footer style={styles.footer}>
                <p>&copy; Umar Hussain.</p>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        backgroundColor: "#f4f8fb",
        fontFamily: "'Roboto', sans-serif",
    },
    header: {
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#007bff",
        color: "#fff",
        width: "100%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    headerTitle: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    headerSubtitle: {
        fontSize: "1.2rem",
    },
    card: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        width: "90%",
        maxWidth: "400px",
        margin: "20px 0",
    },
    cardTitle: {
        fontSize: "1.8rem",
        marginBottom: "20px",
        color: "#333",
    },
    fileInput: {
        display: "block",
        margin: "20px auto",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        width: "100%",
        maxWidth: "350px",
    },
    button: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",
        fontSize: "1rem",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    loadingText: {
        color: "#007bff",
        fontWeight: "bold",
        marginTop: "20px",
    },
    prediction: {
        marginTop: "20px",
        fontSize: "1.2rem",
        color: "#333",
    },
    footer: {
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#f4f8fb",
        color: "#666",
        fontSize: "0.9rem",
        width: "100%",
    },
};

export default App;
