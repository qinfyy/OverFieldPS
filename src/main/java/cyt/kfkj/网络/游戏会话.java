package cyt.kfkj.网络;

import java.io.*;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.xerial.snappy.Snappy;
import com.google.protobuf.MessageLite;
import cyt.kfkj.proto.PacketHead;

@Slf4j
public class 游戏会话 implements Runnable {
    private static final int 头部长度 = 2;

    private final Socket 套接字;
    private final InputStream 输入流;
    private final OutputStream 输出流;
    private final ByteArrayOutputStream 缓冲区 = new ByteArrayOutputStream();

    public 游戏会话(Socket 套接字) throws IOException {
        this.套接字 = 套接字;
        this.输入流 = 套接字.getInputStream();
        this.输出流 = 套接字.getOutputStream();
    }

    @Override
    public void run() {
        try {
            byte[] 临时缓冲区 = new byte[4096];
            int 已读字节;
            while ((已读字节 = 输入流.read(临时缓冲区)) != -1) {
                缓冲区.write(临时缓冲区, 0, 已读字节);
                处理缓冲数据();
            }
        } catch (IOException 异常) {
            log.error("连接异常", 异常);
        } finally {
            关闭连接();
        }
    }

    private void 处理缓冲数据() {
        byte[] 数据 = 缓冲区.toByteArray();
        while (数据.length >= 头部长度) {
            int 头部实际长度 = ByteBuffer.wrap(数据, 0, 头部长度).getShort() & 0xFFFF;
            if (数据.length < 头部长度 + 头部实际长度)
                break;

            try {
                PacketHead 包头 = PacketHead.parseFrom(
                        Arrays.copyOfRange(数据, 头部长度, 头部长度 + 头部实际长度));

                int 总长度 = 头部长度 + 头部实际长度 + 包头.getBodyLen();
                if (数据.length < 总长度)
                    break;

                byte[] 正文数据 = Arrays.copyOfRange(数据, 头部长度 + 头部实际长度, 总长度);
                正文数据 = 处理正文数据(包头.getFlag(), 正文数据);

                log.info("接收消息: " + 包头.getMsgId());
                数据包工厂.处理数据(包头.getMsgId(), 正文数据, this);

                数据 = Arrays.copyOfRange(数据, 总长度, 数据.length);
                缓冲区.reset();
                缓冲区.write(数据);
            } catch (Exception 异常) {
                log.error("数据包处理失败", 异常);
                break;
            }
        }
    }

    private byte[] 处理正文数据(int 标记, byte[] 正文) throws IOException {
        if (标记 == 1) {
            return Snappy.uncompress(正文);
        }
        return 正文;
    }

    public void 发送(int 消息编号, MessageLite 内容) throws IOException {
        log.info("发送消息: " + 消息编号);
        PacketHead 包头 = PacketHead.newBuilder()
                .setMsgId(消息编号)
                .setBodyLen(内容.getSerializedSize())
                .setFlag(0)
                .build();

        ByteBuffer 头部缓冲 = ByteBuffer.allocate(头部长度)
                .putShort((short) 包头.getSerializedSize());

        输出流.write(头部缓冲.array());
        输出流.write(包头.toByteArray());
        输出流.write(内容.toByteArray());
        输出流.flush();
    }

    private void 关闭连接() {
        try {
            套接字.close();
        } catch (IOException 异常) {
            log.error("关闭连接失败", 异常);
        }
    }
}