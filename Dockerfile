# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy the built files from the previous stage
COPY --from=builder /app/dist ./dist

# Hugging Face Spaces expects the app to run on port 7860
EXPOSE 7860

# Start the server
CMD ["serve", "-s", "dist", "-l", "7860"]

