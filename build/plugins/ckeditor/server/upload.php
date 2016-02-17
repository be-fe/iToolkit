<?php

$file = $_POST['upload'];
$callback = "1";
$remotefilePath ="http://leiquan.website/img/bymax.png";
echo "<script type=\"text/javascript\">";
echo "window.parent.CKEDITOR.tools.callFunction(".$callback.",'".$remotefilePath."',''". ")";
echo "</script>";

?>