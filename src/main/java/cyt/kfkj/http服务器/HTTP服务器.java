package cyt.kfkj.http服务器;

import lombok.extern.slf4j.Slf4j;
import io.javalin.Javalin;
import cyt.kfkj.http服务器.http处理器.调度处理器;
import cyt.kfkj.http服务器.http处理器.登录处理器;
import cyt.kfkj.http服务器.http处理器.OAuth处理器;

@Slf4j
public class HTTP服务器 {
    public final static String IP地址 = "127.0.0.1";
    public final static int 端口 = 21000;

    public static void 启动() {
        Javalin 服务器 = Javalin.create(配置 -> {
            配置.staticFiles.add(静态文件 -> {
                静态文件.hostedPath = "/static";
                静态文件.directory = "/webstatic/static";
                静态文件.location = io.javalin.http.staticfiles.Location.CLASSPATH;
            });
        }).start(IP地址, 端口);

        log.info("HTTP服务器已启动，监听地址：http://{}:{}/", IP地址, 端口);

        服务器.after(ctx -> {
            log.info("<< {} {} - {}", ctx.method(), ctx.path(), ctx.status());
        });

        服务器.get("/", ctx -> ctx.result("hello, World"));
        服务器.post("/dispatch/client_hot_update", 调度处理器.热更);
        服务器.post("/dispatch/region_info", 调度处理器.区域);

        服务器.get("/open/oauth", OAuth处理器.授权页面);
        服务器.get("/open/scode", OAuth处理器.验证码);

        服务器.post("/open/uloginDo", new 登录处理器());

        服务器.get("/login.success", ctx -> {
            ctx.status(500);
        });
        服务器.post("/dispatch/get_login_url_list", ctx -> {
            ctx.result("{}");
        });
    }
}