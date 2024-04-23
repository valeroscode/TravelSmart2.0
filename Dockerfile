# Stage 1: Build React frontend
FROM node:18.15.0 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Go backend
FROM golang:1.20.4 AS backend-builder
# Set the working directory inside the container
WORKDIR /app
# Copy the Go module files to the container
COPY backend/go.mod backend/go.sum ./
# Download dependencies using go mod
RUN go mod download
# Copy the rest of the backend source code to the container
COPY backend/*.go ./
# Build the Go binary
RUN go build -o backend/app


# Stage 3: Final container with frontend and backend
FROM golang:1.20.4
WORKDIR /app
# Copy frontend build output from frontend-builder stage to current directory
COPY --from=frontend-builder /app/build ./
# Expose the port on which the backend binary will listen (adjust as needed)
EXPOSE 10000
# Copy backend binary from backend-builder stage to current directory
COPY --from=backend-builder /app/backend/app ./backend
# Set the command to run the backend binary
CMD ["./backend/app"]