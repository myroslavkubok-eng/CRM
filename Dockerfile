# ===========================================
# Stage 1: Build
# ===========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (layer caching)
COPY ["CRMKatia.csproj", "./"]
RUN dotnet restore "CRMKatia.csproj"

# Copy source code and build
COPY . .
RUN dotnet publish "CRMKatia.csproj" -c Release -o /app/publish --no-restore

# ===========================================
# Stage 2: Runtime
# ===========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Create uploads directory
RUN mkdir -p /app/wwwroot/uploads && chown -R appuser:appuser /app

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy published app from build stage
COPY --from=build /app/publish .

# Switch to non-root user
USER appuser

ENTRYPOINT ["dotnet", "CRMKatia.dll"]