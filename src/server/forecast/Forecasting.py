import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from pymongo import MongoClient

import os
from dotenv import load_dotenv

load_dotenv()

mongodb_uri = os.getenv('MONGODB_URI')

# Function to format months as MM/YYYY
def format_months(months, latest_year):
    formatted_months = []
    for month in months:
        month_str = str(month)
        if len(month_str) == 1:
            month_str = '0' + month_str  # Add leading zero if needed
        if int(month_str[:2]) > 12:  # Check if month is greater than 12
            month_str = '01-' + str(latest_year + 1)  # Increment year
        else:
            month_str = month_str + '-' + str(latest_year)
        formatted_months.append(month_str)
    return formatted_months

# Function to group target by month
def group_target_by_month(months, target):
    if not isinstance(months, np.ndarray):
        months = np.array(months)
    if not isinstance(target, np.ndarray):
        target = np.array(target)
    unique_months = np.unique(months)
    grouped_target = []
    for month in unique_months:
        monthly_target = sum(target[np.where(months == month)])
        grouped_target.append(monthly_target)
    return unique_months, np.array(grouped_target)

# Connect to MongoDB Atlas
client = MongoClient(mongodb_uri)
db = client.get_database("pyforecastBackup")  # Replace "your_database_name" with your actual database name
collection = db.forecasts  # Replace "forecast" with your actual collection name

# Fetch data from MongoDB Atlas
data = collection.find_one()

# Extract months and target from the data
months = np.array(data["months_id"])
target = np.array(data["target"])

# Determine the latest year and month from the last item in the data
latest_month = data["months"][-1]
latest_month_int, latest_year = map(int, latest_month.split("-"))

# Group target by month
months, target = group_target_by_month(months, target)

# Format months as MM/YYYY
formatted_months = format_months(months, latest_year)

# Create a linear regression model
model = LinearRegression()

# Fit the model to the data
model.fit(months.reshape(-1, 1), target)

# Make predictions for each month (1 to 12)
X_new = np.arange(1, len(months) + 4).reshape(-1, 1)  # Extend the range to include forecasted months
y_pred = model.predict(X_new)

# Calculate R-squared
r_squared = model.score(months.reshape(-1, 1), target)
# print("R-squared:", r_squared)

# Calculate mean squared error (MSE)
mse = mean_squared_error(target, model.predict(months.reshape(-1, 1)))
# print("Mean Squared Error (MSE):", mse)

# Print the slope and intercept of the regression line
# print("\nSlope (Coefficient):", model.coef_[0])
# print("Intercept:", model.intercept_)

# Forecast target for the next 3 months (13 to 15)
X_forecast = np.arange(len(months) + 1, len(months) + 4).reshape(-1, 1)
y_forecast = model.predict(X_forecast)

# Compute the next months and years based on the latest month in the data
next_months = [(latest_month_int + i) % 12 or 12 for i in range(1, 4)]  # Increment months by 1, 2, 3
next_years = [latest_year + (latest_month_int + i - 1) // 12 for i in range(1, 4)]  # Adjust year if needed

# Format the forecasted months
formatted_forecast_months = [f"{month:02d}-{year}" for month, year in zip(next_months, next_years)]

# Combine the initial months with the forecasted months
formatted_months_extended = data["months"] + formatted_forecast_months

# Extend the dataset with forecasted target
target_extended = np.concatenate([target, y_forecast])

# Retrain the model on the extended dataset
months_extended = np.arange(1, len(formatted_months_extended) + 1).reshape(-1, 1)
model_extended = LinearRegression()
model_extended.fit(months_extended, target_extended)

# Print the updated slope and intercept of the regression line
# print("\nUpdated Slope (Coefficient):", model_extended.coef_[0])
# print("Updated Intercept:", model_extended.intercept_)
# print("Months:", formatted_months_extended)  # Print formatted months extended
# Print the target values as floats without scientific notation
# print("Target Values:", [float(f"{value:.2f}") for value in target_extended])

# Update the data dictionary with the extended months and target, MSE, and R-squared
data["months"] = formatted_months_extended
data["months_id"] = months_extended.flatten().tolist()
data["target"] = target_extended.tolist()
data["mse"] = mse
data["r_squared"] = r_squared

# Post the updated data back to the server
post_response = collection.replace_one({}, data)

# Check if the POST request was successful
if post_response.modified_count > 0:
    print("Data successfully updated.")
else:
    print("Failed to update data.")
