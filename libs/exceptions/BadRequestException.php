<?php

class BadRequestException extends Exception {

    public function __construct($message = 'Invalid request') {
        parent::__construct($message);
    }

}