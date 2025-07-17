CREATE TABLE `favorite_snippets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`snippetId` integer NOT NULL,
	`userId` integer NOT NULL,
	`version` text DEFAULT '1.0.0' NOT NULL,
	`isLatestVersion` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`snippetId`) REFERENCES `snippets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `snippet_favorites_snippet` ON `favorite_snippets` (`snippetId`);--> statement-breakpoint
CREATE INDEX `snippet_favorites_user` ON `favorite_snippets` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_snippet_favorite` ON `favorite_snippets` (`snippetId`,`userId`);--> statement-breakpoint
CREATE TABLE `snippet_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`snippetId` integer NOT NULL,
	`version` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`code` text NOT NULL,
	`change_log` text,
	`createdBy` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`snippetId`) REFERENCES `snippets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `snippet_versions_snippet` ON `snippet_versions` (`snippetId`);--> statement-breakpoint
CREATE INDEX `snippet_versions_version` ON `snippet_versions` (`version`);--> statement-breakpoint
CREATE INDEX `snippet_versions_created_at` ON `snippet_versions` (`createdAt`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_snippet_version` ON `snippet_versions` (`snippetId`,`version`);