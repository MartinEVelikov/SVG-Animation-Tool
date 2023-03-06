<?php

declare(strict_types=1);

class SvgEndpointHandler {

    public static function create($userId): Svg {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $svg = new Svg($data['content'], $data['styles'], $userId);

        return SvgRepository::insert($svg);
    }

    
    public static function getAllByUserId($userId): array {
        return SvgRepository::fetchByUserId($userId);
    }

    public static function update(): void {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        SvgRepository::update((int)$data['id'], $data['styles']);
    }

    public static function delete(): void {
        
    }

}
