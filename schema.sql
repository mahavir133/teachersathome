CREATE DATABASE IF NOT EXISTS teachersathome;
USE teachersathome;

CREATE TABLE IF NOT EXISTS tutors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    rating DECIMAL(3, 2),
    reviewsCount INT DEFAULT 0,
    title VARCHAR(255),
    qualification VARCHAR(255),
    experienceYears INT,
    subjects JSON,
    boards JSON,
    cities JSON,
    localities JSON,
    pricePerHour INT,
    pricePerMonth INT,
    gender ENUM('Female', 'Male', 'Any'),
    mode VARCHAR(100),
    bio TEXT,
    verified BOOLEAN DEFAULT false,
    phone VARCHAR(50),
    badge VARCHAR(100),
    badgeColor VARCHAR(100),
    classesHandled JSON,
    demoClassAvailable BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS parent_requests (
    id VARCHAR(50) PRIMARY KEY,
    parentName VARCHAR(255) NOT NULL,
    studentName VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    studentClass VARCHAR(100),
    board VARCHAR(100),
    subjects JSON,
    city VARCHAR(100),
    locality VARCHAR(255),
    preferredGender VARCHAR(50),
    preferredTiming VARCHAR(255),
    mode VARCHAR(100),
    notes TEXT,
    status VARCHAR(50),
    createdAt DATETIME
);

CREATE TABLE IF NOT EXISTS tutor_applications (
    id VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    qualification VARCHAR(255),
    experienceYears INT,
    subjects JSON,
    cities JSON,
    preferredMode VARCHAR(100),
    bio TEXT,
    status VARCHAR(50),
    createdAt DATETIME
);
