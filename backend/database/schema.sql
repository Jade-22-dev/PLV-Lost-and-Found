-- ==========================================================
-- DATABASE: plvIntegrity
-- SYSTEM: IntegrITy Campus Lost & Found System
-- ==========================================================

DROP DATABASE IF EXISTS plvIntegrity;
CREATE DATABASE plvIntegrity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plvIntegrity;

-- 1. DEPARTMENTS
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(20) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_department_code UNIQUE (department_code)
);

-- 2. COURSES
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    course_code VARCHAR(30) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_courses_departments FOREIGN KEY (department_id) REFERENCES departments (department_id) ON DELETE CASCADE
);

-- 3. SECTIONS (Normalized lookup table para sa mga section ng bawat course)
CREATE TABLE sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    section_name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_sections_courses FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE CASCADE
);

-- 4. LOCATIONS
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(10) NOT NULL,
    specific_area VARCHAR(100) NOT NULL
);

-- 5. USERS (Base table para sa lahat ng uri ng user)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NULL,
    user_role VARCHAR(20) NOT NULL DEFAULT 'Member',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments (department_id) ON DELETE SET NULL,
    CONSTRAINT chk_users_role CHECK (user_role IN ('Member', 'Admin', 'Faculty'))
);

-- 6. STUDENTS (Normalized: gumagamit na ng section_id foreign key)
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_number VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    section_id INT NOT NULL,
    CONSTRAINT uq_students_user UNIQUE (user_id),
    CONSTRAINT uq_students_number UNIQUE (student_number),
    CONSTRAINT fk_students_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_students_courses FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE CASCADE,
    CONSTRAINT fk_students_section FOREIGN KEY (section_id) REFERENCES sections (section_id) ON DELETE CASCADE
);

-- 7. FACULTIES
CREATE TABLE faculties (
    faculty_id VARCHAR(10) NOT NULL,
    user_id INT NOT NULL,
    staff_type VARCHAR(30) NOT NULL,
    CONSTRAINT pk_faculties PRIMARY KEY (faculty_id),
    CONSTRAINT uq_faculties_user UNIQUE (user_id),
    CONSTRAINT fk_faculties_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_faculties_staff_type CHECK (staff_type IN ('Academic', 'Non-Academic'))
);

-- 8. ADMINS
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    CONSTRAINT uq_admins_user UNIQUE (user_id),
    CONSTRAINT fk_admins_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- 9. ALLOWED_ADMIN_NUMBERS 
CREATE TABLE allowed_admin_numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_number VARCHAR(30) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_registered TINYINT(1) DEFAULT 0,
    CONSTRAINT uq_allowed_admin UNIQUE (admin_number)
);

-- 10. CATEGORIES
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- 11. ITEMS
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_color VARCHAR(20) NOT NULL,
    item_brand VARCHAR(50) NULL,
    item_identifier VARCHAR(100) NULL,
    item_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_categories FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
);

-- 12. FOUND_ITEMS
CREATE TABLE found_items (
    found_item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    time_found TIME,
    date_found DATE,
    item_condition VARCHAR(20) NOT NULL,
    surrender_status TEXT,
    CONSTRAINT fk_found_items_items FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE,
    CONSTRAINT fk_found_items_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_found_items_locations FOREIGN KEY (location_id) REFERENCES locations (location_id) ON DELETE CASCADE,
    CONSTRAINT chk_found_items_condition CHECK (item_condition IN ('Good', 'Damage', 'Scratched'))
);

-- 13. LOST_ITEMS
CREATE TABLE lost_items (
    lost_item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    time_lost TIME,
    date_lost DATE,
    lost_description TEXT,
    CONSTRAINT uq_lost_items_item UNIQUE (item_id),
    CONSTRAINT fk_lost_items_items FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE,
    CONSTRAINT fk_lost_items_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_lost_items_locations FOREIGN KEY (location_id) REFERENCES locations (location_id) ON DELETE CASCADE
);

-- 14. ITEM_IMAGES
CREATE TABLE item_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_images_item FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);

-- 15. CLAIMS
CREATE TABLE claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    found_item_id INT NOT NULL,
    user_id INT NOT NULL,
    claim_description TEXT NOT NULL,
    contact_phone VARCHAR(11) NOT NULL,
    claim_status VARCHAR(20) NOT NULL,
    date_filed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_returned DATE NULL,
    CONSTRAINT fk_found_item_claims FOREIGN KEY (found_item_id) REFERENCES found_items (found_item_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_claims FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


-- Departments
INSERT INTO departments (department_code, department_name) VALUES
  ('CEIT', 'College of Engineering and Information Technology'),
  ('COED', 'College of Education'),
  ('CABA', 'College of Accountancy and Business Administration'),
  ('CAS',  'College of Arts and Sciences'),
  ('CPAG', 'College of Public Administration and Governance');

-- Courses
INSERT INTO courses (department_id, course_code, course_name)
VALUES
    -- CEIT
    (1, 'BSIT', 'Bachelor of Science in Information Technology'),
    (1, 'BSEE', 'Bachelor of Science in Electrical Engineering'),
    (1, 'BSCE', 'Bachelor of Science in Civil Engineering'),

    -- COED
    (2, 'BECEd', 'Bachelor of Early Childhood Education'),
    (2, 'BSEd-English', 'Bachelor of Secondary Education major in English'),
    (2, 'BSEd-Filipino', 'Bachelor of Secondary Education major in Filipino'),
    (2, 'BSEd-Math', 'Bachelor of Secondary Education major in Mathematics'),
    (2, 'BSEd-Science', 'Bachelor of Secondary Education major in Science'),
    (2, 'BSEd-SS', 'Bachelor of Secondary Education major in Social Studies'),

    -- CABA
    (3, 'BSA', 'Bachelor of Science in Accountancy'),
    (3, 'BSBA-HRM', 'Bachelor of Science in Business Administration major in Human Resource Management'),
    (3, 'BSBA-FM', 'Bachelor of Science in Business Administration major in Financial Management'),
    (3, 'BSBA-MM', 'Bachelor of Science in Business Administration major in Marketing Management'),

    -- CAS
    (4, 'BS Psychology', 'Bachelor of Science in Psychology'),
    (4, 'BA Communication', 'Bachelor of Arts in Communication'),
    (4, 'BSSW', 'Bachelor of Science in Social Work'),

    -- CPAG
    (5, 'BPA', 'Bachelor of Public Administration');

-- Allowed only to register as admin
INSERT INTO allowed_admin_numbers (admin_number, full_name)
VALUES ('ADMIN-0001', 'Juan Dela Cruz');
