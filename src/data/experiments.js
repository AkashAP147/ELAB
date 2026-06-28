export const experiments = [
  {
    id: 'ml-01',
    number: '01',
    title: "Data Visualization with Histograms & Box Plots",
    description: "Develop a program to create histograms for all numerical features and analyze the distribution of each feature. Generate box plots for all numerical features and identify any outliers. Use California Housing dataset.",
    lab: 'Machine Learning',
    code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_california_housing

# Load the California Housing dataset
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)

# Create Histograms for all numerical features
df.hist(figsize=(12, 10), bins=30, edgecolor='black')
plt.suptitle('Histograms of Numerical Features', fontsize=16)
plt.show()

# Generate Box Plots for all numerical features
plt.figure(figsize=(12, 8))
for i, col in enumerate(df.columns, 1):
    plt.subplot(3, 3, i)  # Arrange subplots in a grid
    sns.boxplot(y=df[col], color='skyblue')
    plt.title(col)
plt.suptitle('Box Plots of Numerical Features', fontsize=16)
plt.tight_layout()
plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-02',
    number: '02',
    title: "Correlation Matrix & Pair Plot Analysis",
    description: "Develop a program to Compute the correlation matrix to understand the relationships between pairs of features. Visualize the correlation matrix using a heatmap to know which variables have strong positive/negative correlations. Create a pair plot to visualize pairwise relationships between features. Use California Housing dataset.",
    lab: 'Machine Learning',
    code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing

# Step 1: Load the California Housing Dataset
california_data = fetch_california_housing(as_frame=True)
data = california_data.frame

# Step 2: Compute the correlation matrix
correlation_matrix = data.corr()

# Step 3: Visualize the correlation matrix using a heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5)
plt.title('Correlation Matrix of California Housing Features')
plt.show()

# Step 4: Create a pair plot to visualize pairwise relationships
sns.pairplot(data, diag_kind='kde', plot_kws={'alpha': 0.5})
plt.suptitle('Pair Plot of California Housing Features', y=1.02)
plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-03',
    number: '03',
    title: "Principal Component Analysis (PCA) on Iris Dataset",
    description: "Develop a program to implement Principal Component Analysis (PCA) for reducing the dimensionality of the Iris dataset from 4 features to 2.",
    lab: 'Machine Learning',
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Load the Iris dataset
iris = load_iris()
data = iris.data
labels = iris.target
label_names = iris.target_names

# Convert to a DataFrame for better visualization
iris_df = pd.DataFrame(data, columns=iris.feature_names)

# Perform PCA to reduce dimensionality to 2
pca = PCA(n_components=2)
data_reduced = pca.fit_transform(data)

# Create a DataFrame for the reduced data
reduced_df = pd.DataFrame(data_reduced, columns=['Principal Component 1', 'Principal Component 2'])
reduced_df['Label'] = labels

# Plot the reduced data
plt.figure(figsize=(8, 6))
colors = ['r', 'g', 'b']
for i, label in enumerate(np.unique(labels)):
    plt.scatter(
        reduced_df[reduced_df['Label'] == label]['Principal Component 1'],
        reduced_df[reduced_df['Label'] == label]['Principal Component 2'],
        label=label_names[label],
        color=colors[i]
    )

plt.title('PCA on Iris Dataset')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend()
plt.grid()
plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-04',
    number: '04',
    title: "FIND-S Algorithm Implementation",
    description: "For a given set of training data examples stored in a CSV file, implement and demonstrate the Find-S algorithm to output the most specific hypothesis consistent with the training examples.",
    lab: 'Machine Learning',
    downloadLink: '/training_data.csv',
    code: `import csv
file = open('training_data.csv')
data = list(csv.reader(file))
length = len(data[0]) - 1
h = ['0'] * length
print('Initial Hypothesis:', h)
print('Data:')
for i in data:
    print(i)
data.pop(0)
for i in range(len(data)):
    if data[i][length] == 'Yes':
        for j in range(len(data[i]) - 1):
            if h[j] == '0':
                h[j] = data[i][j]
            if h[j] != data[i][j]:
                h[j] = '?'
print('\\nFinal Hypothesis (Most Specific):', h)`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-05',
    number: '05',
    title: "K-Nearest Neighbors (KNN) Classification",
    description: "Develop a program to implement k-Nearest Neighbour (KNN) algorithm to classify 100 randomly generated values of x in the range [0,1]. Label the first 50 points based on rule (x ≤ 0.5 → Class1, x > 0.5 → Class2). Classify remaining 50 points using KNN for k = 1,2,3,4,5,20,30.",
    lab: 'Machine Learning',
    code: `import numpy as np
import matplotlib.pyplot as plt
from collections import Counter

data = np.random.rand(100)

labels = ['Class1' if x <= 0.5 else 'Class2' for x in data[:50]]

def euclidean_distance(x1, x2):
    return abs(x1 - x2)

def knn_classifier(train_data, train_labels, test_point, k):
    distances = [(euclidean_distance(test_point, train_data[i]), train_labels[i]) for i in range(len(train_data))]
    distances.sort(key=lambda x: x[0])
    k_nearest_neighbors = distances[:k]
    k_nearest_labels = [label for _, label in k_nearest_neighbors]
    return Counter(k_nearest_labels).most_common(1)[0][0]

train_data = data[:50]
train_labels = labels
test_data = data[50:]

k_values = [1, 2, 3, 4, 5, 20, 30]

print('--- k-Nearest Neighbors Classification ---')

results = {}

for k in k_values:
    classified_labels = [knn_classifier(train_data, train_labels, test_point, k) for test_point in test_data]
    results[k] = classified_labels

for k in k_values:
    classified_labels = results[k]
    class1_points = [test_data[i] for i in range(len(test_data)) if classified_labels[i] == 'Class1']
    class2_points = [test_data[i] for i in range(len(test_data)) if classified_labels[i] == 'Class2']

    plt.figure(figsize=(10, 6))
    plt.scatter(train_data, [0] * len(train_data), c=['blue' if label == 'Class1' else 'red' for label in train_labels], marker='o')
    plt.scatter(class1_points, [1] * len(class1_points), c='blue', marker='x')
    plt.scatter(class2_points, [1] * len(class2_points), c='red', marker='x')

    plt.title(f'k-NN Classification Results for k = {k}')
    plt.xlabel('Data Points')
    plt.ylabel('Classification Level')
    plt.grid(True)
    plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-06',
    number: '06',
    title: "Locally Weighted Regression (LWR)",
    description: "Implement the non-parametric Locally Weighted Regression (LWR) algorithm to fit data points. Use a suitable dataset and draw graphs to visualize the regression curve.",
    lab: 'Machine Learning',
    code: `import numpy as np
import matplotlib.pyplot as plt

def gaussian_kernel(x, xi, tau):
    return np.exp(-np.sum((x - xi) ** 2) / (2 * tau ** 2))

def locally_weighted_regression(x, X, y, tau):
    m = X.shape[0]
    weights = np.array([gaussian_kernel(x, X[i], tau) for i in range(m)])
    W = np.diag(weights)
    X_transpose_W = X.T @ W
    theta = np.linalg.inv(X_transpose_W @ X) @ X_transpose_W @ y
    return x @ theta

np.random.seed(42)
X = np.linspace(0, 2 * np.pi, 100)
y = np.sin(X) + 0.1 * np.random.randn(100)

X_bias = np.c_[np.ones(X.shape), X]

x_test = np.linspace(0, 2 * np.pi, 200)
x_test_bias = np.c_[np.ones(x_test.shape), x_test]

tau = 0.5

y_pred = np.array([locally_weighted_regression(xi, X_bias, y, tau) for xi in x_test_bias])

plt.figure(figsize=(10, 6))
plt.scatter(X, y, color='red', label='Training Data', alpha=0.7)
plt.plot(x_test, y_pred, color='blue', label=f'LWR Fit (tau={tau})', linewidth=2)
plt.xlabel('X', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.title('Locally Weighted Regression', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-07',
    number: '07',
    title: "Linear & Polynomial Regression",
    description: "Develop a program to demonstrate the working of Linear Regression and Polynomial Regression. Use California Housing Dataset for Linear Regression and Auto MPG Dataset for Polynomial Regression (vehicle fuel efficiency prediction).",
    lab: 'Machine Learning',
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_squared_error, r2_score

def linear_regression_california():
    housing = fetch_california_housing(as_frame=True)
    X = housing.data[['AveRooms']]
    y = housing.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    plt.scatter(X_test, y_test, color='blue', label='Actual')
    plt.plot(X_test, y_pred, color='red', label='Predicted')
    plt.xlabel('Average number of rooms (AveRooms)')
    plt.ylabel('Median value of homes (\$100,000)')
    plt.title('Linear Regression - California Housing Dataset')
    plt.legend()
    plt.show()
    print('Mean Squared Error:', mean_squared_error(y_test, y_pred))
    print('R^2 Score:', r2_score(y_test, y_pred))

def polynomial_regression_auto_mpg():
    url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data'
    column_names = ['mpg','cylinders','displacement','horsepower','weight','acceleration','model_year','origin']
    data = pd.read_csv(url, sep='\\s+', names=column_names, na_values='?')
    data = data.dropna()
    X = data['displacement'].values.reshape(-1,1)
    y = data['mpg'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    poly_model = make_pipeline(PolynomialFeatures(degree=2), StandardScaler(), LinearRegression())
    poly_model.fit(X_train, y_train)
    y_pred = poly_model.predict(X_test)
    plt.scatter(X_test, y_test, color='blue', label='Actual')
    plt.scatter(X_test, y_pred, color='red', label='Predicted')
    plt.xlabel('Displacement')
    plt.ylabel('Miles per gallon (mpg)')
    plt.title('Polynomial Regression - Auto MPG Dataset')
    plt.legend()
    plt.show()
    print('Mean Squared Error:', mean_squared_error(y_test, y_pred))
    print('R^2 Score:', r2_score(y_test, y_pred))

if __name__ == '__main__':
    print('Demonstrating Linear Regression and Polynomial Regression')
    linear_regression_california()
    polynomial_regression_auto_mpg()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-08',
    number: '08',
    title: "Decision Tree Classifier",
    description: "Develop a program to demonstrate the working of the Decision Tree algorithm. Use Breast Cancer Dataset for building the decision tree and classify a new sample.",
    lab: 'Machine Learning',
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn import tree
import seaborn as sns

data = load_breast_cancer()
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

print('Model Performance Metrics:')
print('\\nClassification Report:')
print(classification_report(y_test, y_pred, target_names=['Malignant','Benign']))

plt.figure(figsize=(10,8))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')

accuracy = accuracy_score(y_test, y_pred)
print(f'Model Accuracy: {accuracy * 100:.2f}%')

new_sample = np.array([X_test[0]])
prediction = clf.predict(new_sample)
prediction_class = 'Benign' if prediction == 1 else 'Malignant'
print(f'Predicted Class for the new sample: {prediction_class}')

plt.figure(figsize=(12,8))
tree.plot_tree(clf, filled=True, feature_names=data.feature_names, class_names=data.target_names)
plt.title('Decision Tree - Breast Cancer Dataset')
plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-09',
    number: '09',
    title: "Naive Bayes Classifier for Face Recognition",
    description: "Develop a program to implement the Naive Bayesian classifier considering Olivetti Face Dataset for training. Compute the accuracy of the classifier using test datasets and cross-validation.",
    lab: 'Machine Learning',
    code: `import numpy as np
from sklearn.datasets import fetch_olivetti_faces
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt

data = fetch_olivetti_faces(shuffle=True, random_state=42)
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

gnb = GaussianNB()
gnb.fit(X_train, y_train)
y_pred = gnb.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy * 100:.2f}%')

print('\\nClassification Report:')
print(classification_report(y_test, y_pred, zero_division=1))

print('\\nConfusion Matrix:')
print(confusion_matrix(y_test, y_pred))

cross_val_accuracy = cross_val_score(gnb, X, y, cv=5, scoring='accuracy')
print(f'\\nCross-validation accuracy: {cross_val_accuracy.mean() * 100:.2f}%')

fig, axes = plt.subplots(3, 5, figsize=(12, 8))
for ax, image, label, prediction in zip(axes.ravel(), X_test, y_test, y_pred):
    ax.imshow(image.reshape(64, 64), cmap=plt.cm.gray)
    ax.set_title(f'True: {label}, Pred: {prediction}')
    ax.axis('off')

plt.show()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'ml-10',
    number: '10',
    title: "K-Means Clustering with PCA Visualization",
    description: "Develop a program to implement K-Means clustering using Wisconsin Breast Cancer dataset and visualize the clustering result using PCA.",
    lab: 'Machine Learning',
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_breast_cancer
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import confusion_matrix, classification_report

def load_and_prepare_data():
    data = load_breast_cancer()
    X = data.data
    y = data.target
    return X, y

def scale_data(X):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled

def perform_kmeans(X_scaled):
    kmeans = KMeans(n_clusters=2, random_state=42)
    y_kmeans = kmeans.fit_predict(X_scaled)
    return kmeans, y_kmeans

def evaluate_model(y, y_kmeans):
    print('Confusion Matrix:')
    print(confusion_matrix(y, y_kmeans))
    print('\\nClassification Report:')
    print(classification_report(y, y_kmeans))

def perform_pca(X_scaled):
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)
    return X_pca, pca

def create_dataframe(X_pca, y_kmeans, y):
    df = pd.DataFrame(X_pca, columns=['PC1', 'PC2'])
    df['Cluster'] = y_kmeans
    df['True Label'] = y
    return df

def plot_clusters(df):
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=df, x='PC1', y='PC2', hue='Cluster', palette='Set1', s=100, edgecolor='black', alpha=0.7)
    plt.title('K-Means Clustering of Breast Cancer Dataset')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.legend(title='Cluster')
    plt.show()

def plot_true_labels(df):
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=df, x='PC1', y='PC2', hue='True Label', palette='coolwarm', s=100, edgecolor='black', alpha=0.7)
    plt.title('True Labels of Breast Cancer Dataset')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.legend(title='True Label')
    plt.show()

def plot_centroids(df, kmeans, pca):
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=df, x='PC1', y='PC2', hue='Cluster', palette='Set1', s=100, edgecolor='black', alpha=0.7)
    centers = pca.transform(kmeans.cluster_centers_)
    plt.scatter(centers[:, 0], centers[:, 1], s=200, c='red', marker='X', label='Centroids')
    plt.title('K-Means Clustering with Centroids')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.legend(title='Cluster')
    plt.show()

def main():
    X, y = load_and_prepare_data()
    X_scaled = scale_data(X)
    kmeans, y_kmeans = perform_kmeans(X_scaled)
    evaluate_model(y, y_kmeans)
    X_pca, pca = perform_pca(X_scaled)
    df = create_dataframe(X_pca, y_kmeans, y)
    plot_clusters(df)
    plot_true_labels(df)
    plot_centroids(df, kmeans, pca)

if __name__ == '__main__':
    main()`,
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-01',
    number: '01',
    title: "Experiment 1",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 1.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-02',
    number: '02',
    title: "Experiment 2",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 2.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-03',
    number: '03',
    title: "Experiment 3",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 3.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-04',
    number: '04',
    title: "Experiment 4",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 4.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-05',
    number: '05',
    title: "Experiment 5",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 5.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-06',
    number: '06',
    title: "Experiment 6",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 6.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-07',
    number: '07',
    title: "Experiment 7",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 7.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-08',
    number: '08',
    title: "Experiment 8",
    description: "Download the PDF to view the experiment details.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view this experiment.`,
    downloadLink: '/devop/EXP 8.pdf',
    explanation: [],
    output: [],
    textOutput: ''
  },
  {
    id: 'devop-09',
    number: '09',
    title: "Lab Manual",
    description: "Download the Lab Manual PDF.",
    lab: 'DEVOP',
    code: `// Please download the PDF file to view the lab manual.`,
    downloadLink: '/devop/Lab manual (1).pdf',
    explanation: [],
    output: [],
    textOutput: ''
  }
];
