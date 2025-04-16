package cyt.kfkj.网络;

public interface 数据包处理器 {
    void 处理(游戏会话 会话, byte[] 数据) throws Exception;
}