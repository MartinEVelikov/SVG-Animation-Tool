<?php

declare(strict_types=1);

class Svg {

    private $id;

    private $content;

    private $styles;

    private $userId;

    public function __construct(string $content, string $styles = null, int $userId) {
        $this->content = $content;
        $this->styles = $styles;
        $this->userId = $userId;
    }

    public function getContent(): string  {
        return $this->content;
    }

    public function getStyles(): ?string  {
        return $this->styles;
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId($id) {
        $this->id = (int)$id;
    }

    public function getUserId(): int {
        return $this->userId;
    }

    public function toArray(): array {

        return [
            'id' => $this->getId(),
            'content' => $this->getContent(),
            'styles' => $this->getStyles(),
            'userId' => $this->getUserId(),
        ];

    }

    public static function createFromDbResponse($row): Svg {
        $svg = new Svg($row['content'], $row['styles'], (int)$row['userId']);
        $svg->setId($row['id']);

        return $svg;
    }

}