# Edusential — Abnormal Learning Behaviour Detection

An AI-based student learning analytics system that detects **abnormal learning behaviour** using an autoencoder-based anomaly detection approach. The system analyzes pseudocode activity, coding practice, coding test performance, attendance, consistency, and inactivity patterns to identify students whose learning behaviour significantly differs from the expected normal pattern.

## 🚀 Project Overview

**Edusential** is designed to identify potentially unusual or disengaged learning behaviour from student activity data.

The system uses an **autoencoder architecture** to learn the reconstruction patterns of students labeled as normal. Students whose reconstruction error exceeds predefined thresholds are classified as anomalous and assigned a severity level.

### Core capabilities

* Detect abnormal student learning behaviour
* Identify medium- and high-severity anomalies
* Calculate an anomaly score using reconstruction error
* Identify the top features contributing to an anomaly
* Visualize anomaly distributions and model performance
* Predict the behaviour of a new student using manually entered feature values
* Save the trained model for later inference

---

## 📊 Dataset

The current dataset contains:

| Property             |     Value |
| -------------------- | --------: |
| Total records        | **1,019** |
| Total columns        |    **16** |
| Normal records       |   **899** |
| Anomalous records    |   **120** |
| Model input features |     **8** |

### Feature set

The autoencoder uses the following eight behavioural features:

| Feature                      | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| `pseudocode_attendance_rate` | Attendance percentage for pseudocode-related learning activities |
| `pseudocode_avg_score`       | Average pseudocode assessment score                              |
| `coding_practice_solved_pct` | Percentage of coding practice problems completed                 |
| `coding_test_overall_score`  | Overall coding test performance                                  |
| `coding_test_attendance`     | Attendance percentage for coding tests                           |
| `weekly_score_consistency`   | Consistency of weekly assessment performance                     |
| `practice_problems_solved`   | Number of practice problems solved                               |
| `weeks_zero_activity`        | Number of weeks with no recorded learning activity               |

The dataset also contains student metadata and ground-truth/anomaly-related fields used for analysis and evaluation.

---

# 🧠 Methodology

## Autoencoder-Based Anomaly Detection

The project uses an autoencoder with the following structure:

```text
Input Layer
    ↓
8 Features
    ↓
Encoder
    ↓
4-Dimensional Latent Representation
    ↓
Decoder
    ↓
8 Reconstructed Features
```

The model learns to reconstruct the behavioural patterns of the **899 normal students**.

For each student, the reconstruction error is calculated as:

```text
Reconstruction Error =
Mean((Original Features - Reconstructed Features)²)
```

A higher reconstruction error indicates that the student's behavioural pattern differs more substantially from the patterns learned from normal students.

---

## ⚙️ Model Configuration

| Parameter            |               Value |
| -------------------- | ------------------: |
| Input dimensions     |                   8 |
| Latent dimensions    |                   4 |
| Scaling              |     Min-Max Scaling |
| Training samples     | 899 normal students |
| Training epochs      |                 500 |
| Learning rate        |                0.01 |
| Threshold percentile |     90th percentile |
| Random seed          |                  42 |

The current implementation uses a manually implemented encoder/decoder architecture with:

* ReLU activation in the encoder
* Sigmoid activation in the decoder
* Mean squared reconstruction error
* Min-Max normalization before training

---

# 🎯 Anomaly Thresholds

The base threshold is calculated from the **90th percentile of reconstruction errors** observed on the normal training data.

### Current threshold

```text
Base Threshold: 0.145438
Medium Cutoff: 0.145438
High Cutoff:   0.290876
```

The classification logic is:

```text
Reconstruction Error ≤ 0.145438
        → NORMAL

0.145438 < Reconstruction Error ≤ 0.290876
        → MEDIUM

Reconstruction Error > 0.290876
        → HIGH
```

In simplified form:

```text
Score ≤ threshold
    → Normal

threshold < Score ≤ 2 × threshold
    → Medium Risk

Score > 2 × threshold
    → High Risk
```

The threshold can be modified in the training code by changing:

```python
self.threshold = float(np.percentile(errs, 90))
```

For example:

```text
90th percentile → more students can enter the anomaly region
95th percentile → stricter threshold
99th percentile → very strict threshold
```

The exact number of detected anomalies will depend on the dataset and resulting reconstruction-error distribution.

---

# 📈 Current Results

The model was evaluated on the complete dataset of **1,019 records**.

### Detection results

```text
Total Students       : 1019
Normal Predictions   : 837
Medium Risk          : 129
High Risk            : 53
Total Flagged        : 182
```

### Classification metrics

| Metric    |     Result |
| --------- | ---------: |
| Accuracy  | **88.42%** |
| Precision | **50.55%** |
| Recall    | **76.67%** |
| F1 Score  | **60.93%** |
| ROC-AUC   | **94.52%** |

### Class-wise performance

| Class            | Precision | Recall | F1-Score | Support |
| ---------------- | --------: | -----: | -------: | ------: |
| Normal           |      0.97 |   0.90 |     0.93 |     899 |
| Anomalous        |      0.51 |   0.77 |     0.61 |     120 |
| Macro Average    |      0.74 |   0.83 |     0.77 |    1019 |
| Weighted Average |      0.91 |   0.88 |     0.89 |    1019 |

The ROC-AUC of **0.9452** indicates that the reconstruction-error score provides strong separation between the labeled normal and anomalous records in this dataset.

---

# 🔍 Reconstruction Error Analysis

The observed reconstruction errors are:

| Statistic                 |        Value |
| ------------------------- | -----------: |
| Mean — Normal students    | **0.068981** |
| Mean — Anomalous students | **0.416300** |
| Overall mean              | **0.109882** |
| Minimum                   | **0.003572** |
| Maximum                   | **1.514643** |
| Standard deviation        | **0.175787** |

The substantially different mean reconstruction errors between the normal and anomalous groups provide the basis for anomaly scoring.

---

# 👨‍🎓 New Student Prediction

The trained model can also evaluate a new student using eight behavioural inputs.

Example input:

```text
Pseudocode Attendance Rate       : 50
Pseudocode Average Score         : 23
Coding Practice Solved (%)      : 23
Coding Test Overall Score       : 1
Coding Test Attendance          : 98
Weekly Score Consistency        : 99
Practice Problems Solved       : 1
Weeks with Zero Activity        : 1
```

### Prediction

```text
Anomaly Score : 0.281855
Is Anomaly    : True
Severity      : MEDIUM
```

### Top contributing reconstruction errors

```text
coding_test_overall_score : 0.773866
weekly_score_consistency  : 0.388658
pseudocode_avg_score      : 0.351287
```

The system therefore provides both a classification and an indication of which behavioural features produced the largest reconstruction errors.

---

# 📊 Visualizations

The project generates five analytical plots.

### 1. Reconstruction Error Distribution

Compares reconstruction-error distributions between normal and anomalous students and displays the medium/high thresholds.

```text
plot1_recon_error_distribution.png
```

### 2. Confusion Matrix

Shows the number of correctly and incorrectly classified records.

```text
plot2_confusion_matrix.png
```

### 3. ROC Curve

Visualizes the classification capability across different score thresholds.

```text
plot3_roc_curve.png
```

### 4. Per-Feature Reconstruction Error

Compares the average reconstruction error contributed by each input feature for normal and anomalous groups.

```text
plot4_feature_recon_error.png
```

### 5. Student-Level Anomaly Scatter Plot

Displays reconstruction errors for individual students along with the medium and high thresholds.

```text
plot5_student_scatter.png
```

---

# 💾 Trained Model

The trained model is serialized using Python's `pickle` module:

```text
autoencoder_model.pkl
```

The saved model contains:

* Feature scaler
* Encoder weights
* Decoder weights
* Bias parameters
* Learned anomaly threshold

The model can be loaded later for inference without retraining.

Example:

```python
import pickle

with open("autoencoder_model.pkl", "rb") as f:
    model = pickle.load(f)
```

---

# ▶️ How to Run

## Option 1 — Google Colab

Open the notebook in Google Colab and run the cells sequentially.

The notebook contains the complete workflow:

```text
Load dataset
     ↓
Select behavioural features
     ↓
Separate normal/anomalous records
     ↓
Train autoencoder on normal records
     ↓
Calculate reconstruction errors
     ↓
Determine anomaly threshold
     ↓
Predict anomaly severity
     ↓
Evaluate model
     ↓
Generate visualizations
     ↓
Save trained model
     ↓
Predict new students
```

## Option 2 — Local Python Environment

Install the required libraries:

```bash
pip install numpy pandas scikit-learn matplotlib seaborn
```

Then run the notebook using Jupyter or another compatible environment.

---
# 📁 Project Structure

```text
edusentinel/
│
├── Abnormal_Learning_Behaviour_Detection.ipynb   # Google Colab notebook
├── autoencoder_model.pkl                          # Trained autoencoder model
├── Ish's paper.pdf                                # Project/research paper
├── README.md                                      # Project documentation
│
└── results/                                       # Model output visualizations
    ├── plot1_recon_error_distribution.png
    ├── plot2_confusion_matrix.png
    ├── plot3_roc_curve.png
    ├── plot4_feature_recon_error.png
    └── plot5_student_scatter.png
```

### 📂 File Description

| File / Folder                                 | Description                                                                                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Abnormal_Learning_Behaviour_Detection.ipynb` | Complete Google Colab notebook containing data processing, model training, anomaly detection, evaluation, visualization, and new-student prediction |
| `autoencoder_model.pkl`                       | Serialized trained autoencoder model used for anomaly prediction                                                                                    |
| `Ish's paper.pdf`                             | Research/project paper associated with the Edusential project                                                                                       |
| `README.md`                                   | Documentation describing the project, methodology, results, and usage                                                                               |
| `results/`                                    | Contains the visualizations and evaluation plots generated by the model                                                                             |

---

# 🔬 Why Autoencoders?

Traditional classification methods generally require a large number of accurately labeled examples for each class.

An autoencoder-based anomaly detection approach is useful when the objective is to learn the characteristics of **normal behaviour** and identify records that deviate from it.

In this project:

```text
Normal Student Data
        ↓
Autoencoder learns normal patterns
        ↓
Reconstruction
        ↓
Reconstruction Error
        ↓
Anomaly Score
        ↓
Severity Classification
```

This makes reconstruction error a natural measure for identifying unusual learning patterns.

---

# ⚠️ Evaluation Considerations

The current reported results should be interpreted in the context of the present experimental setup.

The autoencoder is trained using the **899 records labeled as normal**, and the resulting model is then scored across all **1,019 records**. The threshold is derived from the reconstruction errors of the normal training records.

Therefore, these metrics are useful for demonstrating the current implementation, but they should **not be interpreted as an independent production benchmark**.

For a stronger experimental evaluation, future versions can include:

* Train/validation/test splits
* A completely held-out test set
* Threshold selection using validation data
* Cross-validation or repeated experiments
* Precision-recall curves
* Additional anomaly-detection metrics
* Comparison against Isolation Forest, One-Class SVM, LOF, and other baseline methods
* Statistical significance testing across repeated runs

These improvements would make the methodology more suitable for a formal research publication.

---

# 🛠️ Technology Stack

```text
Python
NumPy
Pandas
Scikit-learn
Matplotlib
Seaborn
Google Colab
Jupyter Notebook
Pickle
```

---

# 🎯 Project Objective

The primary objective of **Edusential** is to provide a data-driven approach for identifying unusual learning behaviour from student activity patterns.

The system is intended as an **analytical and early-warning tool**, where anomaly scores can help identify students whose recorded behaviour differs from the learned normal pattern.

An anomaly score should be treated as an indicator for further investigation rather than as a definitive judgment about a student's ability, intent, or academic status.

---

# 📌 Key Results at a Glance

```text
Dataset                    : 1,019 students
Normal records             : 899
Anomalous records          : 120

Input features             : 8
Latent dimensions           : 4
Training epochs             : 500

Base threshold             : 0.145438
High-risk threshold         : 0.290876

Accuracy                   : 88.42%
Precision                  : 50.55%
Recall                     : 76.67%
F1 Score                   : 60.93%
ROC-AUC                    : 94.52%

Normal predictions         : 837
Medium-risk predictions    : 129
High-risk predictions      : 53
Total flagged              : 182
```


---

# 👨‍💻 Author

**Edusential — Abnormal Learning Behaviour Detection**

Developed as a machine-learning/data-science project focused on student behavioural analytics and anomaly detection.
