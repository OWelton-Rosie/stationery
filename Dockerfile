FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy the entire src directory into nginx html root
COPY src/ .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
