<?php

class SvgRepository {

    private static $tableName = 'svgs';

    public static function insert(Svg $svg): Svg {

        $conn = (new Db())->getConnection();

        $insertStatement = $conn->prepare("
            INSERT INTO " . self::$tableName . " (content, styles, userId)
            VALUES (:content, :styles, :userId)
        ");

        // inserts the user into the db
        $insertSuccessful = $insertStatement->execute([
            'content' => $svg->getContent(),
            'styles' => $svg->getStyles(),
            'userId' => $svg->getUserId(),
        ]);

        if ($insertSuccessful) {
            $svg->setId($conn->lastInsertId());
            return $svg;
        } else {
            throw new RepositoryException($insertStatement->errorInfo()[2]);
        }
    }

    public static function fetchAll(): array {

        $conn = (new Db())->getConnection();

        $sql = "SELECT * FROM " . self::$tableName;

        $query = $conn->query($sql);

        $allSvgs = [];
        while ($row = $query->fetch()) {
            $allSvgs[] = Svg::createFromDbResponse($row);
        }

        return $allSvgs;
    }

    public static function fetchByUserId(int $userId): array {
        $conn = (new Db())->getConnection();

        $sql = "SELECT * FROM " . self::$tableName . " WHERE userId = " . $userId;

        $query = $conn->query($sql);

        $allSvgs = [];
        while ($row = $query->fetch()) {
            $allSvgs[] = Svg::createFromDbResponse($row);
        }

        return $allSvgs;
    }

    public static function update(int $id, string $styles = null): void {
        $conn = (new Db())->getConnection();

        $sql = "UPDATE " . self::$tableName . " SET styles = '" . $styles . "' WHERE id = " . $id;

        $query = $conn->query($sql);
        $row = $query->fetch();
    }
}
