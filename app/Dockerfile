# Use Node.js as the base image
FROM node:18


RUN npm install -g nodemon

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install 
# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 5555
CMD ["npm", "run", "dev"]
