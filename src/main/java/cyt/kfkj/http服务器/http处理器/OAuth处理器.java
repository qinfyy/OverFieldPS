package cyt.kfkj.http服务器.http处理器;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import io.javalin.http.Handler;

public class OAuth处理器 {

    public static Handler 授权页面 = ctx -> {
        InputStream 输入流 = OAuth处理器.class.getClassLoader().getResourceAsStream("webstatic/oauth.html");
        if (输入流 == null) {
            ctx.status(404);
            return;
        }

        String html = new String(输入流.readAllBytes(), StandardCharsets.UTF_8);
        ctx.contentType("text/html");
        ctx.result(html);
    };

    public static Handler 验证码 = ctx -> {
        InputStream 输入流 = OAuth处理器.class.getClassLoader().getResourceAsStream("webstatic/scode.png");
        if (输入流 == null) {
            ctx.status(404);
            return;
        }

        ctx.contentType("image/png");
        ctx.result(输入流.readAllBytes());
    };
}
