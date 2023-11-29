# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /JuDe/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your application will run
EXPOSE 8080

# Command to run your application
CMD ["node", "src/app.js"]
