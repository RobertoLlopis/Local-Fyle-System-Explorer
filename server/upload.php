<?php
    include 'utils.php'; 

    if(isset($_FILES['file'])){
        $path_until_new_file = $_POST['path'];
    
        if ( 0 < $_FILES['file']['error'] ) {
            echo json_encode(['Error' => $_FILES['file']['error']]);
        }
        else {
            $fileName = $_FILES['file']['name'];
            move_uploaded_file($_FILES['file']['tmp_name'], $path_until_new_file .'/'. $fileName);
            echo json_encode(gatherResourceData($fileName, $path_until_new_file));
        }    
    }
    
?>