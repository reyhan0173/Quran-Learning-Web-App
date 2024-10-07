# Use an official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your backend will run on
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
