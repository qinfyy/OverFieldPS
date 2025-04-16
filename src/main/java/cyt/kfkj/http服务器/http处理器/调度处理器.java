package cyt.kfkj.http服务器.http处理器;

import io.javalin.http.Handler;
import com.alibaba.fastjson2.JSON;
import cyt.kfkj.http服务器.数据类.调度响应;

public class 调度处理器 {
    public static Handler 热更 = ctx -> {
        调度响应 响应 = new 调度响应();
        响应.setStatus(true);
        响应.setMessage("success");
        响应.setHotOssUrl("https://cdn-of.inutan.com/Resources");
        响应.setCurrentVersion("2025-03-21-17-15-05_2025-04-23-14-26-40");
        响应.setServer("cn_prod_main");
        响应.setSsAppId("c969ebf346794cc797ed6eb6c3eac089");
        响应.setSsServerUrl("https://te-of.inutan.com");
        响应.setOpen_gm(false);
        响应.setOpen_error_log(false);
        响应.setOpen_netConnecting_log(false);
        响应.setIpAddress("59.42.239.132");
        响应.setPayUrl("http://api-callback-of.inutan.com:19701");
        响应.setIsTestServer(false);
        响应.setError_log_level(2);
        响应.setReservedParameter1("10001");

        ctx.result(JSON.toJSONString(响应));
    };

    public static Handler 区域 = ctx -> {
        调度响应 响应 = new 调度响应();
        响应.setStatus(true);
        响应.setMessage("success");
        响应.setGate_tcp_ip("127.0.0.1");
        响应.setGate_tcp_port(11033);
        响应.setIs_server_open(true);
        响应.setText("");
        响应.setClient_log_tcp_ip("127.0.0.1");
        响应.setClient_log_tcp_port(11033);

        ctx.result(JSON.toJSONString(响应));
    };
}
