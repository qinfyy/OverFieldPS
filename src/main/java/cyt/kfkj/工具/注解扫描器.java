package cyt.kfkj.工具;

import java.io.File;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.net.JarURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

public class 注解扫描器 {
    public static Set<Class<?>> 扫描包下注解类(String 包名, Class<? extends Annotation> 注解类型) throws IOException, ClassNotFoundException {
        Set<Class<?>> 类集合 = new HashSet<>();
        String 路径 = 包名.replace('.', '/');
        Enumeration<URL> 资源 = Thread.currentThread().getContextClassLoader().getResources(路径);

        while (资源.hasMoreElements()) {
            URL url = 资源.nextElement();
            String 协议 = url.getProtocol();

            if ("file".equals(协议)) {
                String 文件路径 = URLDecoder.decode(url.getFile(), StandardCharsets.UTF_8);
                扫描文件系统(包名, 文件路径, 注解类型, 类集合);
            } else if ("jar".equals(协议)) {
                JarURLConnection 连接 = (JarURLConnection) url.openConnection();
                扫描Jar包(连接.getJarFile(), 路径, 注解类型, 类集合);
            }
        }

        return 类集合;
    }

    private static void 扫描文件系统(String 包名, String 文件路径, Class<? extends Annotation> 注解类型, Set<Class<?>> 类集合) throws ClassNotFoundException {
        File 目录 = new File(文件路径);

        if (!目录.exists() || !目录.isDirectory())
            return;

        for (File 文件 : 目录.listFiles()) {
            if (文件.isDirectory()) {
                扫描文件系统(包名 + "." + 文件.getName(), 文件.getAbsolutePath(), 注解类型, 类集合);
            } else if (文件.getName().endsWith(".class")) {
                String 类名 = 包名 + "." + 文件.getName().replace(".class", "");
                Class<?> 类 = Class.forName(类名);
                if (类.isAnnotationPresent(注解类型)) {
                    类集合.add(类);
                }
            }
        }
    }

    private static void 扫描Jar包(JarFile jarFile, String 路径前缀, Class<? extends Annotation> 注解类型, Set<Class<?>> 类集合) throws ClassNotFoundException {
        Enumeration<JarEntry> 条目 = jarFile.entries();

        while (条目.hasMoreElements()) {
            JarEntry 条目对象 = 条目.nextElement();
            String 条目名 = 条目对象.getName();

            if (条目名.startsWith(路径前缀) && 条目名.endsWith(".class") && !条目对象.isDirectory()) {
                String 类名 = 条目名.replace('/', '.').replace(".class", "");
                Class<?> 类 = Class.forName(类名);
                if (类.isAnnotationPresent(注解类型)) {
                    类集合.add(类);
                }
            }
        }
    }
}
