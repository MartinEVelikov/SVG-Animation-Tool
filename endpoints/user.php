<?php

require_once "../libs/Bootstrap.php";

Bootstrap::init();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST': { // create
        $createdUser = UserEndpointHandler::create();
        echo json_encode($createdUser->toArray());
        break;
    }
    case 'GET': { // read

        if (!SessionEndpointHandler::getLoginStatus()) {
            throw new AuthenticationException("Нямате достъп до този ресурс");
        }

        $allUsers = UserEndpointHandler::getAll();
        $formattedUsers = [];
        foreach ($allUsers as $user) {
            $formattedUsers[] = $user->toArray();
        }
        echo json_encode($formattedUsers);
        break;
    }
    case 'PUT': { // update
        break;
    }
    case 'DELETE': { // delete
        break;
    }
}
