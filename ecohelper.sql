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
(5901088009730, 44, '{\"comments\":[{\"commentContent\": \"Pustą butelke po wodzie należy wrzucić do pojemnika z plastikiem\",\"commentPoints\": 5},{\"commentContent\": \"Pustą butelke nalezy wlozyc sobie w dupe\",\"commentPoints\": -15}]}', '{\"alternatives\":[{\"alternativeContent\": \"Butelka filtrująca Dafi\",\"alternativePoints\": 5,\"alternativeImage\": \"https://sklep.dafi.pl/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/b/u/butelka-0_5-eko.jpg\"},{\"alternativeContent\": \"Picie z rzeki\",\"alternativePoints\": -15,\"alternativeImage\": \"\"}]}', NULL);

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
