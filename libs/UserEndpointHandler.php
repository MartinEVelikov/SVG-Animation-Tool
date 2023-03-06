<?php

declare(strict_types=1);

class UserEndpointHandler {

    /**
     * Registers a new user to the system
     * 
     * @return newly created user
     */
    public static function create(): User {

        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $user = new User($data['email'], $data['password']);

        // check if the user is valid

        return UserRepository::insert($user);
    }

    public static function getOne(): User {
        
    }

    
    public static function getAll(): array {
        return UserRepository::fetchAll();
    }

    public static function update(): User {

    }

    public static function delete(): void {
        
    }

}
