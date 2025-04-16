package cyt.kfkj.网络;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import cyt.kfkj.工具.注解扫描器;

@Slf4j
public class 数据包工厂 {
    private static final Map<Integer, 数据包处理器> 处理器集合 = new HashMap<>();

    public static void 初始化处理器() {
        try {
            Set<Class<?>> 类集合 = 注解扫描器.扫描包下注解类("cyt.kfkj.处理器类", 包处理器.class);

            for (Class<?> 类 : 类集合) {
                包处理器 注解实例 = 类.getAnnotation(包处理器.class);
                处理器集合.put(注解实例.value(), (数据包处理器) 类.getDeclaredConstructor().newInstance());
                log.debug("已注册处理器，消息ID为: {}", 注解实例.value());
            }

            log.info("共注册了 " + 处理器集合.size() + " 个处理器");

        } catch (Exception 异常) {
            log.error("处理器注册失败", 异常);
        }
    }


    public static void 处理数据(int 消息编号, byte[] 数据内容, 游戏会话 会话对象) {
        数据包处理器 对应处理器 = 处理器集合.get(消息编号);
        if (对应处理器 != null) {
            try {
                对应处理器.处理(会话对象, 数据内容);
            } catch (Exception 异常) {
                log.error("执行处理器时出错", 异常);
            }
        } else {
            log.warn("未找到对应的消息ID处理器: {}", 消息编号);
        }
    }
}