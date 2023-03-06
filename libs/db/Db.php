<?php

class Db {

    private $connection;

    public function __construct() {

        $dbConfig = Config::getConfig()['db'];

        $this->connection = new PDO("mysql:host={$dbConfig['host']};dbname={$dbConfig['name']}", $dbConfig['username'],
            $dbConfig['password'],
            [
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
    }

    public function getConnection() {
        return $this->connection;
    }
}