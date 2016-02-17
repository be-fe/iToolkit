package com.adam.servlet;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class Upload extends HttpServlet {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /**
     * Constructor of the object.
     */
    public Upload() {
        super();
    }

    private static String baseDir;// CKEditor的根目录
    private static SimpleDateFormat dirFormatter;// 目录命名格式:yyyyMM
    private static SimpleDateFormat fileFormatter;// 文件命名格式:yyyyMMddHHmmssSSS

    /**
     * Initialization of the servlet. <br>
     *
     * @throws ServletException
     *             if an error occurs
     */
    public void init() throws ServletException {
        // Put your code here
        dirFormatter = new SimpleDateFormat("yyyyMM");
        fileFormatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        baseDir = getInitParameter("baseDir");
        if (baseDir == null)
            baseDir = "/UserFiles/";
        String realBaseDir = getServletContext().getRealPath(baseDir);
        File baseFile = new File(realBaseDir);
        if (!baseFile.exists()) {
            baseFile.mkdirs();
        }
    }

    /**
     * The doGet method of the servlet. <br>
     *
     * This method is called when a form has its tag value method equals to get.
     *
     * @param request
     *            the request send by the client to the server
     * @param response
     *            the response send by the server to the client
     * @throws ServletException
     *             if an error occurred
     * @throws IOException
     *             if an error occurred
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html; charset=UTF-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        // String typeStr = request.getParameter("Type");
        String typeStr = "image";
        Date dNow = new Date();
        String currentPath = baseDir + typeStr + "/"
                + dirFormatter.format(dNow);
        String currentDirPath = getServletContext().getRealPath(currentPath);
        // 判断文件夹是否存在，不存在则创建
        File dirTest = new File(currentDirPath);
        if (!dirTest.exists()) {
            dirTest.mkdirs();
        }
        // 将路径前加上web应用名
        currentPath = request.getContextPath() + currentPath;
        String newName = "";
        String fileUrl = "";
        String remotefilePath = "";
        FileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List items = upload.parseRequest(request);
            Map fields = new HashMap();
            Iterator iter = items.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                if (item.isFormField())
                    fields.put(item.getFieldName(), item.getString());
                else
                    fields.put(item.getFieldName(), item);
            }
            // CEKditor中file域的name值是upload
            FileItem uplFile = (FileItem) fields.get("upload");
            // 获取文件名并做处理
            String fileNameLong = uplFile.getName();
            fileNameLong = fileNameLong.replace('\\', '/');
            String[] pathParts = fileNameLong.split("/");
            String fileName = pathParts[pathParts.length - 1];
            // 获取文件扩展名
            String ext = getExtension(fileName);
            // 设置上传文件名
            fileName = fileFormatter.format(dNow) + "." + ext;
            // 获取文件名(无扩展名)
            String nameWithoutExt = getNameWithoutExtension(fileName);
            File pathToSave = new File(currentDirPath, fileName);
            fileUrl = currentPath + "/" + fileName;
            int counter = 1;
            newName = nameWithoutExt + "_" + counter + "." + ext;
            fileUrl = currentPath + "/" + newName;
            pathToSave = new File(currentDirPath, newName);
            remotefilePath = "http://" + request.getServerName() + ":"
                    + request.getServerPort() + "/" + fileUrl;
            counter++;
            uplFile.write(pathToSave);
            request.setAttribute("image", remotefilePath);
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
        String callback = request.getParameter("CKEditorFuncNum");
        out.println("<script type=\"text/javascript\">");
        out.println("window.parent.CKEDITOR.tools.callFunction(" + callback
                + ",'" + remotefilePath + "',''" + ")");
        out.println("</script>");
        out.flush();
        out.close();
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private static String getNameWithoutExtension(String fileName) {
        return fileName.substring(0, fileName.lastIndexOf("."));
    }

    public void destroy() {
        super.destroy(); // Just puts "destroy" string in log
        // Put your code here
    }

}