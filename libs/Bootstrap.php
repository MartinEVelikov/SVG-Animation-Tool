<?php

class Bootstrap {

    public static function init(): void {
        self::registerExceptionHandlers();
        self::registerClassLoader();
    }

    private static function registerExceptionHandlers() {
        set_exception_handler(function ($e) {

            $errorCode = 500;

            $error = [
                'error' => true
            ];

            if ($e instanceof RepositoryException) {
                $error['message'] = 'Exception with database operation: ' . $e->getMessage();
                $errorCode = 500;
            }
            elseif ($e instanceof AuthenticationException) {
                $errorCode = 401;
            }
            elseif ($e instanceof NotFoundException) {
                $error['message'] = $e->getMessage();
                $errorCode = 404;
            }
            elseif ($e instanceof BadRequestException) {
                $error['message'] = $e->getMessage();
                $errorCode = 400;
            }

            echo json_encode($error);
            http_response_code($errorCode);
        });
    }

    private static function registerClassLoader() {

        spl_autoload_register(function($className) {
            if (file_exists('../libs/' . $className . '.php')) {
                require_once '../libs/' . $className . '.php';
            } elseif (file_exists('../libs/db/' . $className . '.php')) {
                require_once '../libs/db/' . $className . '.php';
            } elseif (file_exists('../libs/exceptions/' . $className . '.php')) {
                require_once '../libs/exceptions/' . $className . '.php';
            }
        });

    }

}
