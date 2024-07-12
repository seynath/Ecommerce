# Use an official nginx image as the base image
FROM nginx:alpine

# Build arguments
ARG VITE_BASE_URL

# Environment variables
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy the build output to replace the default nginx contents
COPY ./dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
