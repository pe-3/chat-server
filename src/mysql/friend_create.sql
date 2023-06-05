CREATE TABLE `techat`.`firends` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(45) NOT NULL,
  `firend_id` VARCHAR(45) NOT NULL,
  `status` INT NOT NULL DEFAULT 0 是申请、1 是互为好友、2是删除、3是拉黑,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);
