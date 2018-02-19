# README #

TO CREATE TABLES FOR ROLES
==========================
CREATE TABLE `geowebhooks` (
`lga` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
`role` BIGINT(20) NULL DEFAULT NULL,
`shortname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
PRIMARY KEY (`lga`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

TO INSERT DATA INTO THE TABLE FOR ROLES FOR BOT
===============================================
INSERT INTO geowebhooks (lga,role,shortname) VALUES ('<lga = rolename>','<role = RoleID>','<shortname = command used to add/remove role>');

TO DELETE A ROW FROM THE TABLE
==============================
DELETE FROM geowebhooks WHERE lga = '<lga>';


### What is this repository for? ###

VM BOT
 - Games
 - Self add Pokemon GO Team to User
 - Self add/remove Roles from User

### How do I get set up? ###

Git Clone This Repository
Change Config to suit bot
Add Bot to Discord
Create Tables
Add stuff to tables
wa-la

### Contribution guidelines ###

It was all Phil & Travis.

### Who do I talk to? ###

Nobody, your alone on this one.
