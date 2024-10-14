# Use the official lightweight Node.js 14 image
FROM node:16-alpine

# Install Python, make, and g++
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory
COPY . .

# Build the app for production
RUN npm run build

# Install `serve` to serve the build files in production
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Serve the production build
CMD ["serve", "-s", "build", "-l", "3000"]
