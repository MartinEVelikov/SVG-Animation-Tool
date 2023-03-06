<?php

require_once "../libs/Bootstrap.php";

Bootstrap::init();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST': { // create
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        $file = "test.svg";
        $txt = fopen($file, "w") or die("Unable to open file!");
        fwrite($txt, $data['content']);
        fclose($txt);

        echo 1;
        break;
    }
    case 'GET': { // read
        $file = "test.svg";
        header('Content-Description: File Transfer');
        header('Content-Disposition: attachment; filename='.basename($file));
        header("Content-Type: application/force-download");
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        header("Content-Type: text/plain");
        ob_clean();
        flush();
        readfile($file);
        break;
    }
    case 'PUT': { // update
        break;
    }
    case 'DELETE': { // delete
        break;
    }
}
