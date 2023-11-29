# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json /app

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your application will run (adjust accordingly)
EXPOSE 3000

# Command to run your application (adjust accordingly)
CMD ["node", "app.js"]
