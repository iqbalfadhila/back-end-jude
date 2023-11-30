# Gunakan node:lts-alpine sebagai base image
FROM node:lts-alpine

# Set environment production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Update npm to version 10.2.4
RUN npm install -g npm@10.2.4

# Install dependencies in production mode
RUN npm install --production --silent

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Change ownership to the 'node' user
RUN chown -R node /usr/src/app

# Switch to the 'node' user
USER node

# Start the application
CMD ["npm", "start"]
