CREATE TABLE `exam_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`session_id` int NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`submitted_at` timestamp,
	`listening_score` int,
	`structure_score` int,
	`reading_score` int,
	`total_score` int,
	`passed` boolean,
	CONSTRAINT `exam_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` enum('listening','structure','reading') NOT NULL,
	`question_text` text NOT NULL,
	`option_a` varchar(500) NOT NULL,
	`option_b` varchar(500) NOT NULL,
	`option_c` varchar(500) NOT NULL,
	`option_d` varchar(500) NOT NULL,
	`correct_answer` varchar(1) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`starts_at` timestamp NOT NULL,
	`duration_minutes` int NOT NULL,
	`passing_score` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `test_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('participant','admin','leader') NOT NULL DEFAULT 'participant',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `exam_attempts` ADD CONSTRAINT `exam_attempts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exam_attempts` ADD CONSTRAINT `exam_attempts_session_id_test_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `test_sessions`(`id`) ON DELETE no action ON UPDATE no action;