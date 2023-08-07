module.exports = {
    base_html:function(title, body){
        
        return `
        <!DOCTYPE html>
        <html lang="ko">
            <head>
                <meta charset="utf-8" />
                <meta name="home" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="" />
                <meta name="author" content="" />
                <title>${title}</title>
                <!-- Favicon-->
                <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
                <!-- Font Awesome icons (free version)-->
                <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
                <!-- Google fonts-->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500&display=swap" rel="stylesheet">
                <!-- css font-family: 'Noto Serif KR', serif; -->
                <link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding:400" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Do+Hyeon:400" rel="stylesheet">
                <!-- Core theme CSS (includes Bootstrap)-->
                <link href="css/styles.css" rel="stylesheet" />
            </head>
            <body id="page-top">
                <!-- Navigation-->
                <nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
                    <div class="container">
                        <a calss="main-logo" href="./home.html">
                            <img src="assets/img/portfolio/logo_color_change.png" width="30%" class="mx-0 mx-lg-1">
                        </a>
                        <button class="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            Menu
                            <i class="fas fa-bars"></i>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarResponsive">
                            <ul class="navbar-nav ms-auto">
                                <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-0 px-2 rounded" style="font-size: 1.2rem;" href="./create.html">만들기</a></li>
                                <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-0 px-2 rounded" style="font-size: 1.2rem;" href="./about.html">문의</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>            
                ${body}        
                <!-- Footer-->
                <footer class="footer text-center">
                    <!-- Footer About Text-->
                    <h4 style="text-align: right; padding-right: 2rem;">E-mail</h4>
                    <p class="lead mb-0" style="text-align: right; padding-right: 2rem">
                        tjalswhd11345@gmail.com
                    </p>
                </footer>
            </body>
        </html>
        `
    }
}

