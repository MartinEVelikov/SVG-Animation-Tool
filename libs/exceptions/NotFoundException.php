<?php

class NotFoundException extends Exception {

    public function __construct($message = 'The resource cannot be found on the server') {
        parent::__construct($message);
    }

}