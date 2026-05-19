CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewerName` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`message` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduling_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`serviceType` varchar(100) NOT NULL,
	`preferredDate` varchar(30) NOT NULL,
	`address` text NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scheduling_requests_id` PRIMARY KEY(`id`)
);
