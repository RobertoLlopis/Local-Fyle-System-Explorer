<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Little CRUD and display app of a file tree">
    <meta name="author" content="Roberto Llopis">
    <meta name="author" content="Henrique Peña">

    <title>Coverfy file manager</title>
    <link rel="shortcut icon" href="client/assets/coverfy-1.jpg">
    <!-- Custom fonts for this template-->
    <link href="client/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="client/css/template.css" rel="stylesheet">
    <link href="client/css/index.css" rel="stylesheet">

</head>

<body id="page-top">

    <!-- Modal preview files-->
    <div class="preview-modal p-5">
        <div class="preview-close-button">
            <button class="btn btn-circle btn-ligth"><i class="fas fa-times-circle"></i></button>
        </div>
        <div class="preview-display-container">
            <audio controls id="preview-audio" class="media">
                <source src="" type="audio/mpeg">
            </audio>
            <video id="preview-video" controls class="media">
                <source src="" type="video/mp4">
            </video>
            <div class="preview-img-container">
                <img src="" alt="" id="preview-img">
            </div>
        </div>
    </div>

    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Aside container -->
        <ul class="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar">
            <!-- Sidebar - Brand -->
            <a id="logo-container" class="sidebar-brand d-flex align-items-center justify-content-center" href="index.php">
                <img class="logo" src="client\assets\coverfy-logo-b.png">
            </a>
            <!-- Divider -->
            <hr class="sidebar-divider my-0">
            <!-- Nav Item - Pages Collapse Menu -->
            <li id="root-li" data-path="root" class="nav-item">
                <i class="fas fa-server"></i> <span data-path="root" data-type="dir">Root</span>
            </li>
        </ul>
        <!-- End of Sidebar -->
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Topbar -->
            <nav class="navbar navbar-expand navbar-light bg-coverfy topbar static-top shadow">

                <!-- Sidebar Toggle (Topbar) -->
                <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>

                <!-- Topbar Search -->
                <form id="navbar-search" class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div class="input-group">
                        <input type="text" id="search-query" name="search-query" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button class="btn btn-primary" form="navbar-search" type="submit">
                                <i class="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </nav>
            <!-- End of Topbar -->
            <!-- Begin Main Content -->
            <main class="container-fluid d-flex p-0 h-100 main-container">

                <div id="dir-display-container" class="h-100 p-0">
                    <!-- Breadcrumbs and action button container-->
                    <div class="col-12 p-0 d-flex align-items-center">
                        <div id="breadcrumbs-container" class="col-9 d-flex py-4 pl-4 pr-0">

                        </div>
                        <div id="add-new-button-container" class="col-3 p-0 d-flex justify-content-center">
                            <button class="btn btn-primary dropdown-toggle btn-add-new" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-plus"></i> Add new
                            </button>
                            <div class="dropdown-menu animated--fade-in" aria-labelledby="dropdownMenuButton">
                                <div class="dropdown-item file-upload">
                                    <i class="fas fa-file-upload"></i>&nbsp;&nbsp;Upload file</a>
                                    <input type="file" id="upload_input" name="upload" />
                                </div>
                                <a class="dropdown-item folder-create" href="#"><i class="fas fa-folder folder-icon-color"></i>&nbsp;&nbsp;New Folder</a>
                                <a class="dropdown-item file-create" href="#"><i class="far fa-file"></i>&nbsp;&nbsp;New File</a>
                                <input id type="file" style="display:none">
                            </div>
                            <div class="clean-trash hidden" data-path="root/Trash">
                                <button class="btn btn-primary btn-clear-trash">
                                    <i class="fas fa-trash-alt"></i>
                                    Clean Trash
                                </button>
                            </div>
                            <button id="go-back-csv" type="button" class="btn btn-primary">
                                Go Back <i class="fas fa-long-arrow-alt-left"></i>
                            </button>
                        </div>

                    </div>
                    <!-- Main display container -->
                    <div class="card">
                        <div class="card-body">
                            <div id="directory-table-container" class="table-responsive">
                                <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Size</th>
                                            <th>Start date</th>
                                            <th>Last modification</th>
                                            <th>Edit-Delete</th>
                                            <th>Properties</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody">

                                    </tbody>
                                </table>
                            </div>
                            <div id="csv-table-container" class="table-responsive">
                                <table id="csv-table" class="table table-bordered" width="100%" cellspacing="0">
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Info properties display aside section-->
                <div class="properties-view hide-properties">
                    <i class="fas fa-times-circle close-btn mb-4"></i>
                    <div class="properties-content">

                    </div>
                </div>
            </main>
        </div>
    </div>
    <!-- End of Page Wrapper -->
    <!-- Error message -->
    <div id="error-card" class="card border-left-error shadow w-75">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div id="error-message" class="h5 mb-0 text-gray-800">No results with name: jkdhsfh</div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-times-circle fa-2x error-text-color"></i>
                </div>
            </div>
        </div>
    </div>


    <!-- JQuery-->
    <script src="client/vendor/jquery/jquery.min.js"></script>
    <script src="client/vendor/jquery-easing/jquery.easing.min.js"></script>
    <!-- App JavaScript-->
    <script src="client/js/icons.js"></script>
    <script src="client/js/index.js"></script>
    <script src="client/js/search.js"></script>
    <script src="client/js/crud.js"></script>
    <script src="client/js/preview.js"></script>
    <script src="client/js/dragAndDrop.js"></script>
    <script src="client/js/breadcrumbUrl.js"></script>
    <script src="client/js/propertiesView.js"></script>
    <!-- Bootstrap core JavaScript-->
    <script src="client/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

</body>

</html>