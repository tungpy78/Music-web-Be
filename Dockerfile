# --- Stage 1: Build Stage ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build your project (if using TypeScript, Webpack, etc.)
RUN npm run build

# --- Stage 2: Production Stage ---
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Only include production dependencies (optional if already pruned)
# RUN npm prune --production

# Start the application
CMD ["node", "dist/index.js"]
