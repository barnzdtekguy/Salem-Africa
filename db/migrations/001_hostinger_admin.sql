SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` boolean NOT NULL DEFAULT false,
  `image` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `role` varchar(64) NOT NULL DEFAULT 'user',
  `banned` boolean DEFAULT false,
  `banReason` text DEFAULT NULL,
  `banExpires` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(36) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `userId` varchar(36) NOT NULL,
  `impersonatedBy` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_unique` (`token`),
  KEY `session_user_id_idx` (`userId`),
  CONSTRAINT `session_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(36) NOT NULL,
  `accountId` varchar(255) NOT NULL,
  `providerId` varchar(255) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `accessToken` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `idToken` text DEFAULT NULL,
  `accessTokenExpiresAt` datetime(3) DEFAULT NULL,
  `refreshTokenExpiresAt` datetime(3) DEFAULT NULL,
  `scope` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `account_user_id_idx` (`userId`),
  KEY `account_provider_account_idx` (`providerId`, `accountId`),
  CONSTRAINT `account_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `verification_identifier_idx` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rateLimit` (
  `key` varchar(255) NOT NULL,
  `count` int unsigned NOT NULL,
  `lastRequest` bigint unsigned NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `content_items` (
  `id` varchar(36) NOT NULL,
  `kind` varchar(32) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `title` varchar(180) NOT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'draft',
  `publish_at` datetime(3) DEFAULT NULL,
  `starts_at` datetime(3) DEFAULT NULL,
  `ends_at` datetime(3) DEFAULT NULL,
  `publication_date` date DEFAULT NULL,
  `image_url` varchar(2048) DEFAULT NULL,
  `image_alt` varchar(300) NOT NULL DEFAULT '',
  `data` json NOT NULL,
  `version` int unsigned NOT NULL DEFAULT 1,
  `created_by` varchar(36) DEFAULT NULL,
  `created_by_email` varchar(255) DEFAULT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `updated_by_email` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_items_slug_unique` (`slug`),
  KEY `content_items_public_idx` (`kind`, `status`, `publish_at`, `starts_at`),
  KEY `content_items_updated_idx` (`updated_at`),
  CONSTRAINT `content_items_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `content_items_updated_by_fk` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `content_items`
  (`id`, `kind`, `slug`, `title`, `status`, `starts_at`, `image_url`, `image_alt`, `data`)
SELECT UUID(), seed.`kind`, seed.`slug`, seed.`title`, 'published', seed.`starts_at`,
       seed.`image_url`, seed.`image_alt`, seed.`data`
FROM (
  SELECT
    'weekly_program' AS `kind`,
    'extraordinary-life-service' AS `slug`,
    'EXTRAORDINARY LIFE SERVICE' AS `title`,
    NULL AS `starts_at`,
    '/assets/events/extraordinary-life-service-flyer.jpg' AS `image_url`,
    'Extraordinary Life Service flyer' AS `image_alt`,
    JSON_OBJECT(
      'dayOfWeek', 'Sunday', 'startTime', '08:00', 'endTime', '',
      'venue', 'Salem International Christian Centre, Off Salem Bus Stop, Lekki, Lagos.',
      'minister', '', 'recurrence', 'weekly', 'specificDates', JSON_ARRAY(),
      'livestreamUrl', '', 'description', 'Join us for the weekly Extraordinary Life Service.',
      'exceptions', JSON_ARRAY()
    ) AS `data`
  UNION ALL
  SELECT
    'weekly_program', 'covenant-breakthrough-service', 'COVENANT BREAKTHROUGH SERVICE',
    NULL, '/assets/events/covenant-breakthrough-service-flyer.jpg',
    'Covenant Breakthrough Service flyer',
    JSON_OBJECT(
      'dayOfWeek', 'Wednesday', 'startTime', '17:30', 'endTime', '',
      'venue', 'Salem International Christian Centre, Off Salem Bus Stop, Lekki, Lagos.',
      'minister', '', 'recurrence', 'weekly', 'specificDates', JSON_ARRAY(),
      'livestreamUrl', '', 'description', 'Join us for the weekly Covenant Breakthrough Service.',
      'exceptions', JSON_ARRAY()
    )
  UNION ALL
  SELECT
    'weekly_program', 'continental-family-prayer-hour', 'CONTINENTAL FAMILY PRAYER HOUR',
    NULL, '/assets/events/continental-family-prayer-hour-flyer.jpg',
    'Continental Family Prayer Hour flyer',
    JSON_OBJECT(
      'dayOfWeek', 'Friday', 'startTime', '06:00', 'endTime', '',
      'venue', 'Salem family across Benin Republic, Togo, and Nigeria.',
      'minister', '', 'recurrence', 'weekly', 'specificDates', JSON_ARRAY(),
      'livestreamUrl', '',
      'description', 'A weekly prayer hour for the Salem family across Benin Republic, Togo, and Nigeria.',
      'exceptions', JSON_ARRAY()
    )
  UNION ALL
  SELECT
    'event', 'salem-outpouring-conference-nigeria-2026',
    'Salem Outpouring Conference Nigeria 2026', '2026-11-10 17:00:00',
    '/assets/events/salem-outpouring-conference-nigeria-2026.webp',
    'Salem Outpouring Conference 2026 flyer',
    JSON_OBJECT(
      'theme', 'Love in Revival',
      'description', 'Six days of outpouring under the theme Love in Revival. Chief host Archbishop Sam Amaga of Salem Family Worldwide, hosted by Bishop Hilary Ogoliegbune, with bishops ministering from across Nigeria, Ghana and the United Kingdom, and music from Faith Dynamite Voice. The heavens are stirred for a release. Come expecting the supernatural, the miraculous and the extraordinary.',
      'startDate', '2026-11-10', 'endDate', '2026-11-15', 'startTime', '17:00',
      'endTime', '', 'venue', 'Holy Ghost Conference Ground, #1 Faith Avenue, Rumuomasi, Port Harcourt',
      'speakers', JSON_ARRAY('Archbishop Sam Amaga', 'Bishop Hilary Ogoliegbune'),
      'registrationUrl', '', 'livestreamUrl', ''
    )
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM `content_items` existing WHERE existing.`slug` = seed.`slug`
);
