# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Backend.sln .
COPY Backend.Domain/Backend.Domain.csproj Backend.Domain/
COPY Backend.Application/Backend.Application.csproj Backend.Application/
COPY Backend.Infrastructure/Backend.Infrastructure.csproj Backend.Infrastructure/
COPY Backend.API/Backend.API.csproj Backend.API/

# Restore dependencies
RUN dotnet restore Backend.sln

# Copy all source code
COPY . .

# Build the solution
RUN dotnet build Backend.sln -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish Backend.API/Backend.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN mkdir -p /app/data
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DB_PATH=/app/data/logistics.db
ENTRYPOINT ["dotnet", "Backend.API.dll"]
