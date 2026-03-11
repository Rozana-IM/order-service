FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (change if your app uses another port)
EXPOSE 4001

# ✅ CORRECT ENTRY POINT
CMD ["node", "src/app.js"]
