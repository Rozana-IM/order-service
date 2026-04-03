FROM node:20-alpine ✅

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port (change if your app uses another port)
EXPOSE 5000

# ✅ CORRECT ENTRY POINT
CMD ["node", "src/app.js"]
