CREATE TABLE IF NOT EXISTS `staff_invitations` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `accepted_at` datetime(3) DEFAULT NULL,
  `revoked_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_invitation_email_unique` (`email`),
  UNIQUE KEY `staff_invitation_token_hash_unique` (`token_hash`),
  KEY `staff_invitation_expiry_idx` (`expires_at`),
  CONSTRAINT `staff_invitation_creator_fk` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `staff_invitation_role_check` CHECK (`role` IN ('administrator', 'editor'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
