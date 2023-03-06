<?php

class SessionEndpointHandler {

    /**
     * Tries to login the user with the given credentials
     * 
     * @throws AuthenticationException when the login failed
     */
    public static function tryToLogin(array $loginData): void {

        $email = $loginData['email'];
        $password = $loginData['password'];

        // validate input data

        $user = UserRepository::fetchByEmail($email);

        if ($user == null) {
            throw new AuthenticationException("Login failed");
        }

        if (!password_verify($password, $user->getPassword())) {
            throw new AuthenticationException("Password is not correct");
        }

        session_start();
        $_SESSION['user_id'] = $user->getId();
    }

    /**
     * Checks if the current user is logged
     * 
     * @return true if the user is logged, false otherwise
     */
    public static function getLoginStatus(): bool {

        session_start();
        return isset($_SESSION['user_id']);
    }

    public static function getLoggedUser(): int {
        return $_SESSION['user_id'];
    }

    public static function logout(): void {

        session_start();
        session_destroy();
    }

}