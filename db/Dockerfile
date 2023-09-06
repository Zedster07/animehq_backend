# Use MySQL as the base image
FROM mysql:8.0

# Set environment variables (customize these as needed)
ENV MYSQL_ROOT_PASSWORD=Biskra@07
ENV MYSQL_DATABASE=algdoc_auth
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=Biskra@07

# Add a database initialization script
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the port the MySQL runs on
EXPOSE 3306