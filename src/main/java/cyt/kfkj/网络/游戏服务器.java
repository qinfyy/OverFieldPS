package cyt.kfkj.网络;

import lombok.extern.slf4j.Slf4j;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

@Slf4j
public class 游戏服务器 {
    private static final int 端口 = 11033;

    public static void 启动() {
        try {
            数据包工厂.初始化处理器();
            try (ServerSocket 服务器套接字 = new ServerSocket(端口)) {
                log.info("服务器在端口 {} 上启动", 端口);
                while (true) {
                    Socket 客户端套接字 = 服务器套接字.accept();
                    log.info("新连接来自 {}", 客户端套接字.getRemoteSocketAddress());
                    new Thread(new 游戏会话(客户端套接字)).start();
                }
            }
        } catch (IOException e) {
            log.error("服务器启动失败", e);
        }
    }
}