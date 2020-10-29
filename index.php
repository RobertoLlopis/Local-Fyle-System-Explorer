<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>SB Admin 2 - Blank</title>

    <!-- Custom fonts for this template-->
    <link href="client/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="client/css/template.css" rel="stylesheet">
    <link href="client/css/index.css" rel="stylesheet">

</head>

<body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Sidebar -->
        <ul class="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar">
            <!-- Sidebar - Brand -->
            <a id="logo-container" class="sidebar-brand d-flex align-items-center justify-content-center" href="index.php">
                <img class="logo" src="client\assets\coverfy-logo-b.png">
            </a>
            <!-- Divider -->
            <hr class="sidebar-divider my-0">
            <!-- Nav Item - Pages Collapse Menu -->
            <li id="root-li" data-path="root/" class="nav-item">
                <i class="fas fa-server"></i> <span>Root</span>
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
                <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div class="input-group">
                        <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </nav>
            <!-- End of Topbar -->
            <!-- Begin Main Content -->
            <main class="container-fluid d-flex p-0 h-100">
                <div id="dir-display-container" class="h-100 p-0">
                    <div class="col-12 p-0">
                        <div id="breadcrumbs-container" class="d-flex py-4 px-4">

                        </div>
                        <div id="add-new-button-container" class="col-3 p-0">
                            <button class="btn btn-primary" type="button"><i class="fas fa-plus"></i> Add new</button>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Size</th>
                                            <th>Start date</th>
                                            <th>Last modification</th>
                                            <th>Preview</th>
                                            <th>Properties</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody">
                                        <tr>
                                            <td><i class="fas fa-folder table-icon folder-icon-color"></i></td>
                                            <td>Folder 1</td>
                                            <td>1.2 MB</td>
                                            <td>28/10/2020 - 11:00</td>
                                            <td>29/10/2020 - 17:00</td>
                                            <td>
                                            </td>
                                            <td>
                                                <a href="#" class="btn btn-light btn-icon-split">
                                                    <span class="icon text-gray-600">
                                                        <i class="fas fa-info-circle"></i>
                                                    </span>
                                                    <span class="text">Info</span>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><i class="far fa-file table-icon"></i></td>
                                            <td>File 1</td>
                                            <td>1.2 MB</td>
                                            <td>28/10/2020 - 11:00</td>
                                            <td>29/10/2020 - 17:00</td>
                                            <td>
                                                <a href="#" class="btn btn-info btn-icon-split">
                                                    <span class="icon text-white-50">
                                                        <i class="fas fa-play"></i>
                                                    </span>
                                                    <span class="text">Preview</span>
                                                </a>
                                            </td>
                                            <td>
                                                <a href="#" class="btn btn-light btn-icon-split">
                                                    <span class="icon text-gray-600">
                                                        <i class="fas fa-info-circle"></i>
                                                    </span>
                                                    <span class="text">Info</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="properties-display-container" class="bg-dark h-100 p-0">
                </div>
            </main>
        </div>
    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-primary" href="login.html">Logout</a>
                </div>
            </div>
        </div>
    </div>
    <script src="client/vendor/jquery/jquery.min.js"></script>
    <script src="client/vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="client/js/icons.js"></script>
    <script src="client/js/index.js"></script>
    <!-- Bootstrap core JavaScript-->
    <script src="client/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->

    <!-- Custom scripts for all pages
    <script src="js/template.js"></script>
    -->

</body>

</html>