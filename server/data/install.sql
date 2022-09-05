CREATE TABLE `{{PREFIX}}products` (
  `id` int(11) NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bid` decimal(10,0) NOT NULL,
  `user` int(11) NOT NULL,
  `users` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `{{PREFIX}}products` (`id`, `title`, `description`, `bid`, `user`, `users`, `expire`) VALUES
(1, 'Product No1', 'Test Description', '16', 1, '', 1662949920),
(2, 'Product No2', 'Test Description', '45', 1, '', 1662040920);

CREATE TABLE `{{PREFIX}}users` (
  `id` int(11) NOT NULL,
  `username` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `bidMax` decimal(10,0) NOT NULL,
  `bidPercentage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `{{PREFIX}}users` (`id`, `username`, `password`, `admin`, `bidMax`, `bidPercentage`) VALUES
(1, 'admin1', 'admin1', 1, '0', 100, ''),
(2, 'reg1', 'reg1', 0, '100', 99, ''),
(3, 'reg2', 'reg2', 0, '0', 100, '');
