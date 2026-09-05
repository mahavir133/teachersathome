USE teachersathome;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TUTOR', 'PARENT') NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'REJECTED') DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Note: We use IF NOT EXISTS logic via ALTER TABLE if possible, or just ignore errors if columns already exist.
-- MariaDB/MySQL doesn't support "ADD COLUMN IF NOT EXISTS" cleanly in 5.7, but it does in 8.0+.
-- We will try the standard way. If it fails (because they exist), it's fine.
ALTER TABLE tutors ADD COLUMN user_id VARCHAR(50);
ALTER TABLE parent_requests ADD COLUMN user_id VARCHAR(50);
ALTER TABLE tutor_applications ADD COLUMN user_id VARCHAR(50);
