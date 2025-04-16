package cyt.kfkj.处理器类;

import cyt.kfkj.网络.CmdId;
import cyt.kfkj.网络.游戏会话;
import cyt.kfkj.网络.包处理器;
import cyt.kfkj.网络.数据包处理器;
import cyt.kfkj.proto.PlayerLoginRsp;
import cyt.kfkj.proto.StatusCode;

import java.time.ZonedDateTime;

@包处理器(CmdId.PlayerLoginReq)
public class 处理PlayerLoginReq implements 数据包处理器 {

    @Override
    public void 处理(游戏会话 会话, byte[] 数据) throws Exception {

        var rsp = PlayerLoginRsp.newBuilder()
                .setAnalysisAccountId("a")
                .setChannelId(1)
                .setClientLogServerToken("dG9rZW4=")
                .setPlayerName("cyt")
                .setStatus(StatusCode.StatusCode_Ok)
                .setRegisterTime(1743602341)
                .setRegionName("cn_prod_main")
                .setServerTimeMs(System.currentTimeMillis())
                .setServerTimeZone(ZonedDateTime.now().getOffset().getTotalSeconds())
                .setSceneId(9999)
                .build();

        会话.发送(CmdId.PlayerLoginRsp, rsp);
    }
}