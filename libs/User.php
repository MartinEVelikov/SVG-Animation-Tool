<?php

declare(strict_types=1);

class User {

    private $id;

    private $email;

    private $password;

    private $registeredOn;

    public function __construct(string $email, string $password, string $registeredOn = null) {
        $this->email = $email;
        $this->password = $password;
        $this->registeredOn = $registeredOn;
    }

    public function getEmail(): string  {
        return $this->email;
    }

    public function getPassword(): string  {
        return $this->password;
    }

    public function getHashedPassword(): string {
        return password_hash($this->password, PASSWORD_DEFAULT);
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId($id) {
        $this->id = (int)$id;
    }

    public function getRegisteredOn(): ?string {
        return $this->registeredOn;
    }

    public function toArray(): array {

        return [
            'id' => $this->getId(),
            'email' => $this->getEmail(),
            'registeredOn' => $this->getRegisteredOn(),
        ];

    }

    public static function createFromDbResponse($row): User {

        $user = new User($row['email'], $row['password'], $row['registered_on']);
        $user->setId($row['id']);

        return $user;
    }

}