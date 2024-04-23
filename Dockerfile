# Stage 1: Build React frontend
FROM node:9.5.0 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Go backend
FROM golang:1.20.4 AS backend-builder
WORKDIR /go/src/app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN go build -o /go/bin/app

# Stage 3: Final container with frontend and backend
FROM golang:1.20.4
WORKDIR /app
# Copy frontend build output from frontend-builder stage to current directory
COPY --from=frontend-builder /app/build ./frontend
# Copy backend binary from backend-builder stage to current directory
COPY --from=backend-builder /go/bin/app ./backend/app
# Set the command to run the backend binary
CMD ["./backend/app"]