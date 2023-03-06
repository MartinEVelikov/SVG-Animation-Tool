<?php

require_once "../libs/Bootstrap.php";

Bootstrap::init();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST': { // create
        
        if (!SessionEndpointHandler::getLoginStatus()) {
            throw new AuthenticationException("Нямате достъп до този ресурс");
        }

        $userId = SessionEndpointHandler::getLoggedUser();

        $createdSvg = SvgEndpointHandler::create($userId);
        echo json_encode($createdSvg->toArray());
        break;
    }
    case 'GET': { // read

        if (!SessionEndpointHandler::getLoginStatus()) {
            throw new AuthenticationException("Нямате достъп до този ресурс");
        }

        $userId = SessionEndpointHandler::getLoggedUser();
        $allSvgs = SvgEndpointHandler::getAllByUserId($userId);

        $formattedSvgs = [];
        foreach ($allSvgs as $svg) {
            $formattedSvgs[] = $svg->toArray();
        }
        echo json_encode($formattedSvgs);
        break;
    }
    case 'PUT': { // update
        if (!SessionEndpointHandler::getLoginStatus()) {
            throw new AuthenticationException("Нямате достъп до този ресурс");
        }

        SvgEndpointHandler::update();
        echo true;
        // echo json_encode($updatedSvg->toArray());
        break;
    }
    case 'DELETE': { // delete
        break;
    }
}
