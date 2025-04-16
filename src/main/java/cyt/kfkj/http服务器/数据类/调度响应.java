package cyt.kfkj.http服务器.数据类;

import lombok.Data;

@Data
public class 调度响应 {
    private Boolean status;
    private String message;
    private String hotOssUrl;
    private String currentVersion;
    private String server;
    private String ssAppId;
    private String ssServerUrl;
    private Boolean open_gm;
    private Boolean open_error_log;
    private Boolean open_netConnecting_log;
    private String ipAddress;
    private String payUrl;
    private Boolean isTestServer;
    private Integer error_log_level;
    private String reservedParameter1;
    private String gate_tcp_ip;
    private Integer gate_tcp_port;
    private Boolean is_server_open;
    private String text;
    private String client_log_tcp_ip;
    private Integer client_log_tcp_port;
}