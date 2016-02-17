<?php

<<<<<<< HEAD
$callback = "1";



//if ($_FILES["upload"]["error"] > 0)
//  {
//  echo "Error: " . $_FILES["upload"]["error"] . "<br />";
//  }
//else
//  {
//  echo "Upload: " . $_FILES["upload"]["name"] . "<br />";
//  echo "Type: " . $_FILES["upload"]["type"] . "<br />";
//  echo "Size: " . ($_FILES["upload"]["size"] / 1024) . " Kb<br />";
//  echo "Stored in: " . $_FILES["upload"]["tmp_name"];
//  }


$remotefilePath ="http://leiquan.website/img/leiquan.jpeg";
 echo "<script type=\"text/javascript\">";
 echo "window.parent.CKEDITOR.tools.callFunction(".$callback.",'".$remotefilePath."',''". ")";
 echo "</script>";
=======
$file = $_POST['upload'];
$callback = "1";
$remotefilePath ="http://leiquan.website/img/bymax.png";
echo "<script type=\"text/javascript\">";
echo "window.parent.CKEDITOR.tools.callFunction(".$callback.",'".$remotefilePath."',''". ")";
echo "</script>";
>>>>>>> 6b7d7ee043aad0c7786c177ba8f1c05d24f046ea

?>