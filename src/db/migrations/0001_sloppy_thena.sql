CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sessions_userid` ON `sessions` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`pfId` text NOT NULL,
	`password` text NOT NULL,
	`shouldChangePassword` integer DEFAULT true NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_pfId_unique` ON `users` (`pfId`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_snippets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`code` text NOT NULL,
	`language` text NOT NULL,
	`createdBy` integer NOT NULL,
	`isApproved` integer DEFAULT false NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_snippets`("id", "title", "description", "code", "language", "createdBy", "isApproved", "isDeleted", "createdAt", "updatedAt") SELECT "id", "title", "description", "code", "language", "createdBy", "isApproved", "isDeleted", "createdAt", "updatedAt" FROM `snippets`;--> statement-breakpoint
DROP TABLE `snippets`;--> statement-breakpoint
ALTER TABLE `__new_snippets` RENAME TO `snippets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `snippets_createdby` ON `snippets` (`createdBy`);