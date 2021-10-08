-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2021 at 11:47 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecohelper`
--

-- --------------------------------------------------------

--
-- Table structure for table `ecohelper`
--

CREATE TABLE `ecohelper` (
  `codeProduct` bigint(255) NOT NULL,
  `co2Cost` double DEFAULT NULL,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comments`)),
  `betterAlternative` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`betterAlternative`)),
  `other` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`other`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ecohelper`
--

INSERT INTO `ecohelper` (`codeProduct`, `co2Cost`, `comments`, `betterAlternative`, `other`) VALUES
(5901088009730, 44, '{\"comments\":[]}', '{\"alternatives\":[]\}\', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ecohelper`
--
ALTER TABLE `ecohelper`
  ADD PRIMARY KEY (`codeProduct`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ecohelper`
--
ALTER TABLE `ecohelper`
  MODIFY `codeProduct` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5901088009731;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
