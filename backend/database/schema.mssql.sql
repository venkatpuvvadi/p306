-- Users Table
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'users')
BEGIN
    CREATE TABLE users
    (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) DEFAULT 'user',
        profile_photo NVARCHAR(MAX),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Media Table
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'media')
BEGIN
    CREATE TABLE media
    (
        id INT IDENTITY(1,1) PRIMARY KEY,
        file_name NVARCHAR(255) NOT NULL,
        file_path NVARCHAR(MAX) NOT NULL,
        file_type NVARCHAR(100),
        file_size BIGINT,
        uploaded_by INT,
        uploaded_at DATETIME DEFAULT GETDATE(),
        is_deleted BIT DEFAULT 0,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
    );
END
GO

-- Initial Admin User
IF NOT EXISTS (SELECT *
FROM users
WHERE username = 'admin')
BEGIN
    INSERT INTO users
        (username, password_hash, role, is_active)
    VALUES
        ('admin', '$2b$08$KILYg3zbEAhFoVwcBNzAwegPNBPCKgVCutGOlMD/X6tnSt3giNryK', 'admin', 1);
        
END
GO
