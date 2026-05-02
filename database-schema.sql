-- ============================================================
-- Emerald Frinters - SQL Server (T-SQL) Database Schema
-- Converted from EF Core Migration: 20260412211121_InitialCreate
-- Database: logistics_db
-- ============================================================

-- Create database (run separately from master if needed)
-- CREATE DATABASE logistics_db;
-- GO
-- USE logistics_db;
-- GO

-- ============================================================
-- ENUM REFERENCE (stored as integers in the database)
-- ============================================================
-- UserRole:         1=Admin, 2=Customer
-- ServiceType:      1=Standard, 2=Express, 3=Overnight,
--                   4=SeaFreightFCL, 5=SeaFreightLCL,
--                   6=AirFreight, 7=LandTransport
-- QuoteStatus:      0=Pending, 1=Approved, 2=Rejected
-- NotificationType: 5=QuoteCreated, 6=General, 7=ContactMessage,
--                   8=QuoteApproved, 9=QuoteRejected, 10=RatingSubmitted

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Users
CREATE TABLE [Users] (
    [Id]                       INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Users] PRIMARY KEY,
    [Email]                    NVARCHAR(255)    NOT NULL,
    [PasswordHash]             NVARCHAR(MAX)    NOT NULL,
    [FirstName]                NVARCHAR(100)    NOT NULL,
    [LastName]                 NVARCHAR(100)    NOT NULL,
    [PhoneNumber]              NVARCHAR(MAX)    NULL,
    [Role]                     INT              NOT NULL,
    [IsActive]                 BIT              NOT NULL,
    [FailedLoginAttempts]      INT              NOT NULL,
    [LockoutUntil]             DATETIME2   NULL,
    [PasswordResetToken]       NVARCHAR(MAX)    NULL,
    [PasswordResetTokenExpiry] DATETIME2   NULL,
    [CompanyName]              NVARCHAR(MAX)    NULL,
    [TaxId]                    NVARCHAR(MAX)    NULL,
    [BillingAddress]           NVARCHAR(MAX)    NULL,
    [ShippingAddress]          NVARCHAR(MAX)    NULL,
    [CreatedAt]                DATETIME2   NOT NULL
);
GO

-- 2. ContactForms
CREATE TABLE [ContactForms] (
    [ContactFormId] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_ContactForms] PRIMARY KEY,
    [Name]          NVARCHAR(200)    NOT NULL,
    [Email]         NVARCHAR(255)    NOT NULL,
    [Phone]         NVARCHAR(MAX)    NULL,
    [Subject]       NVARCHAR(200)    NOT NULL,
    [Message]       NVARCHAR(MAX)    NOT NULL,
    [CreatedAt]     DATETIME2   NOT NULL
);
GO

-- 3. PricingRules
CREATE TABLE [PricingRules] (
    [Id]                INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_PricingRules] PRIMARY KEY,
    [ServiceType]       INT              NOT NULL,
    [BaseRate]          DECIMAL(18, 2)   NOT NULL,
    [WeightRatePerKg]   DECIMAL(18, 4)   NOT NULL,
    [DistanceRatePerKm] DECIMAL(18, 4)   NOT NULL,
    [MinimumCharge]     DECIMAL(18, 2)   NOT NULL,
    [IsActive]          BIT              NOT NULL,
    [EffectiveFrom]     DATETIME2   NOT NULL,
    [EffectiveTo]       DATETIME2   NULL
);
GO

-- 4. Quotes
CREATE TABLE [Quotes] (
    [Id]            INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Quotes] PRIMARY KEY,
    [QuoteNumber]   NVARCHAR(50)     NOT NULL,
    [Origin]        NVARCHAR(255)    NOT NULL,
    [Destination]   NVARCHAR(255)    NOT NULL,
    [ServiceType]   INT              NOT NULL,
    [CargoType]     NVARCHAR(100)    NOT NULL,
    [Weight]        DECIMAL(18, 4)   NOT NULL,
    [ContainerSize] NVARCHAR(MAX)    NULL,
    [Price]         DECIMAL(18, 2)   NOT NULL,
    [Currency]      NVARCHAR(10)     NOT NULL,
    [EstimatedDays] INT              NOT NULL,
    [Distance]      DECIMAL(18, 4)   NOT NULL,
    [IsBooked]      BIT              NOT NULL,
    [Status]        INT              NOT NULL CONSTRAINT [DF_Quotes_Status] DEFAULT (0),
    [UserId]        INT              NULL,
    [CreatedAt]     DATETIME2   NOT NULL,
    [BookedAt]      DATETIME2   NULL,
    CONSTRAINT [FK_Quotes_Users_UserId]
        FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE SET NULL
);
GO

-- 5. Notifications
CREATE TABLE [Notifications] (
    [Id]          INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Notifications] PRIMARY KEY,
    [UserId]      INT              NOT NULL,
    [Title]       NVARCHAR(200)    NOT NULL,
    [Message]     NVARCHAR(500)    NOT NULL,
    [Type]        INT              NOT NULL,
    [IsRead]      BIT              NOT NULL,
    [ReferenceId] NVARCHAR(100)    NULL,
    [CreatedAt]   DATETIME2   NOT NULL,
    CONSTRAINT [FK_Notifications_Users_UserId]
        FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

-- 6. Ratings (one rating per user)
CREATE TABLE [Ratings] (
    [Id]        INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Ratings] PRIMARY KEY,
    [UserId]    INT              NOT NULL,
    [Stars]     INT              NOT NULL,
    [Comment]   NVARCHAR(500)    NULL,
    [CreatedAt] DATETIME2   NOT NULL,
    [UpdatedAt] DATETIME2   NULL,
    CONSTRAINT [FK_Ratings_Users_UserId]
        FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

-- ============================================================
-- INDEXES
-- ============================================================

CREATE UNIQUE INDEX [IX_Users_Email]              ON [Users] ([Email]);
CREATE UNIQUE INDEX [IX_Quotes_QuoteNumber]       ON [Quotes] ([QuoteNumber]);
CREATE        INDEX [IX_Quotes_UserId]            ON [Quotes] ([UserId]);
CREATE        INDEX [IX_Notifications_UserId_IsRead] ON [Notifications] ([UserId], [IsRead]);
CREATE UNIQUE INDEX [IX_Ratings_UserId]           ON [Ratings] ([UserId]);
GO

-- ============================================================
-- SEED DATA (Default Pricing Rules)
-- ============================================================

INSERT INTO [PricingRules] ([ServiceType], [BaseRate], [WeightRatePerKg], [DistanceRatePerKm], [MinimumCharge], [IsActive], [EffectiveFrom], [EffectiveTo])
VALUES
    (1, 10.00, 0.50, 0.10, 15.00, 1, SYSUTCDATETIME(), NULL),  -- Standard
    (2, 20.00, 1.00, 0.20, 30.00, 1, SYSUTCDATETIME(), NULL),  -- Express
    (3, 35.00, 1.50, 0.35, 50.00, 1, SYSUTCDATETIME(), NULL);  -- Overnight
GO
