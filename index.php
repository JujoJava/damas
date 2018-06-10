<?php include("includes/back/variables.php"); ?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <base href="/damas/">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title>Damas Online</title>
        <meta name="description" content="Juego online para jugar a las damas">
        <meta name="author" content="Juanjo">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/jquery-3.3.1.min.js"><\/script>')</script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="js/bootstrap.min.js"></script>
        <!-- Introducir aquí scripts -->
        <script type="text/javascript" src="js/funciones.js"></script>
        <script type="text/javascript" src="js/juego.js"></script>
        <script type="text/javascript" src="js/conexion.js"></script>
        <script type="text/javascript" src="js/carga_info.js"></script>
        <script type="text/javascript" src="js/events.js"></script>

        <!-- favicon -->
        <link rel="apple-touch-icon" sizes="57x57" href="img/favicon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="img/favicon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="img/favicon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="img/favicon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="img/favicon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="img/favicon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="img/favicon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="img/favicon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="img/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="img/favicon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png">
        <link rel="manifest" href="img/favicon/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/fontawesome/css/fontawesome-all.min.css">
        <!-- Introducir aquí hojas de estilo -->
        <link rel="stylesheet" href="css/principal.css">
        <link rel="stylesheet" href="css/tabla.css">
        <link rel="stylesheet" href="css/menu.css">
        <link rel="stylesheet" href="css/modal.css">
        <link rel="stylesheet" href="css/footer.css">
        <link rel="stylesheet" href="css/juego.css">
    </head>
    <body>
        <header>
            <?php include("includes/front/menu-superior.php"); ?>
        </header>
        <main> <?php //separado en dos mitades, la página actual, y la sección (section) de la derecha ?>
            <div>
                <?php include("includes/back/pages.php"); ?>
                <section>
                    <?php include("includes/front/menu-lateral.php"); ?>
                </section>
            </div>
            <?php include("includes/front/menu-inferior.php"); ?>
        </main>
        <footer>
            <?php include("includes/front/footer.html"); ?>
        </footer>
    </body>
</html>
