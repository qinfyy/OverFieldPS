package cyt.kfkj;

import lombok.extern.slf4j.Slf4j;
import cyt.kfkj.http服务器.HTTP服务器;
import cyt.kfkj.网络.游戏服务器;

@Slf4j
public class Main {
    public static void main(String[] args) {
        log.info("OverFieldPS Start");
        HTTP服务器.启动();
        游戏服务器.启动();
    }
}