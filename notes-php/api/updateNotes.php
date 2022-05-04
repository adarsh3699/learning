<?php
	include_once "dbConn.php";
	$resp = array();

    try {
        //getting data from frontend sent in json format
        $data = @json_decode(file_get_contents("php://input"), TRUE);

        //if json decoded successfully
        if (@json_last_error() == JSON_ERROR_NONE) {
            if (@is_array($data)) {
                //our logic
                $id = $data["id"];
                
                $notes = $data["notes"];
                if ($id != "") {  
                    $query = "UPDATE `notes` SET `notes` = '$notes' WHERE `notes`.`id` = $id";
                  
                    if ($queryRun = @mysqli_query($dbLink, $query)) {
                        $title = $data["title"];

                        $notesQuery = "UPDATE `notes` SET `title` = '$title' WHERE notes.id = $id";
                        if ($notesQueryRun = @mysqli_query($dbLink, $notesQuery)) {
                          
                            $resp["statusCode"] = 200;
                            $resp["msg"] = "Notes Updated";
                        } else {
                            $resp["statusCode"] = 400; //bad request
                            $resp["msg"] = "Bad request";
                        }
                    } else {
                        $resp["statusCode"] = 400; //bad request
                        $resp["msg"] = "Bad request";
                    }
                } else {
                    $resp["statusCode"] = 400; //bad request
                    $resp["msg"] = "select a ID"; 
                }
                //our logic
            } else {
                $resp["statusCode"] = 500; //Internal server error
                $resp["msg"] = "Something went wrong";
            }
        } else {
            $resp["statusCode"] = 500; //Internal server error
            $resp["msg"] = "Something went wrong";
        }
    } catch (Throwable $e) {
        $resp["statusCode"] = 500; //bad request
        $resp["msg"] = "Something went wrong " . $e->getMessage();
    }

	print_r(@json_encode($resp));
?>