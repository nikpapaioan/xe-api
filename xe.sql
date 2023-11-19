CREATE TABLE properties (
	id INT(11) NOT NULL auto_increment,
	title VARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,
	area VARCHAR(255) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	description VARCHAR(255),
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
) engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;