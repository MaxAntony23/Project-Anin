# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and projects
COPY ["Infrastructure.slnx", "."]
COPY ["src/InfrastructureAPI/InfrastructureAPI.csproj", "src/InfrastructureAPI/"]
COPY ["src/InfrastructureCore/InfrastructureCore.csproj", "src/InfrastructureCore/"]
COPY ["src/InfrastructureData/InfrastructureData.csproj", "src/InfrastructureData/"]

# Restore dependencies
RUN dotnet restore

# Copy all source code
COPY . .

# Build application
RUN dotnet publish src/InfrastructureAPI/InfrastructureAPI.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "InfrastructureAPI.dll"]
