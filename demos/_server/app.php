<?php
/**
 * Created by IntelliJ IDEA.
 * User: leiquan
 * Date: 16/2/17
 * Time: 下午7:58
 */

// php 接受文件

if ($_FILES["upload"]["error"] > 0) {
    echo "Error: " . $_FILES["upload"]["error"] . "<br>";
} else {

    // 文件存在,则先删除
    if (file_exists("./upload/" . $_FILES["upload"]["name"])) {
        unlink("./upload/" . $_FILES["upload"]["name"]);
    }

    // 移动文件到 upload 文件夹
    move_uploaded_file($_FILES["upload"]["tmp_name"], "upload/" . $_FILES["upload"]["name"]);
    $path = "/demos/_server/" . "upload/" . $_FILES["upload"]["name"];

}

echo "<script type=\"text/javascript\">";

echo "window.parent.CKEDITOR.tools.callFunction('1','" . $path . "','')";

echo "</script>";