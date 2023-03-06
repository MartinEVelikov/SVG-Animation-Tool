<?php

require_once "../libs/Bootstrap.php";

Bootstrap::init();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST': { // login

        $json = file_get_contents('php://input');
        $loginData = json_decode($json, true);

        SessionEndpointHandler::tryToLogin($loginData);
        echo json_encode(['logged' => true]);
        break;
    }
    case 'GET': { // check login status
        $loginStatus = SessionEndpointHandler::getLoginStatus();
        echo json_encode(['loginStatus' => $loginStatus]);
        break;
    }
    case 'DELETE': { // logout
        SessionEndpointHandler::logout();
        echo json_encode(['logged' => false]);
        break;
    }
}

