<?php
    include 'utils.php'; 

    if(isset($_POST)){ echo json_encode($_FILES);
        echo json_encode($_FILES);};
    if(isset($_FILES['file'])){
        $path_until_new_file = $_POST['path'];
    
        if ( 0 < $_FILES['file']['error'] ) {
            echo 'Error: ' . $_FILES['file']['error'] . '<br>';
        }
        else {
            $fileName = $_FILES['file']['name'];
            move_uploaded_file($_FILES['file']['tmp_name'], $path_until_new_file .'/'. $fileName);
            echo json_encode(gatherResourceData($fileName, $path_until_new_file));
        }    
    }
    
?>
