package cyt.kfkj.处理器类;

import cyt.kfkj.网络.CmdId;
import cyt.kfkj.网络.游戏会话;
import cyt.kfkj.网络.包处理器;
import cyt.kfkj.网络.数据包处理器;
import cyt.kfkj.proto.VerifyLoginTokenReq;
import cyt.kfkj.proto.VerifyLoginTokenRsp;
import cyt.kfkj.proto.StatusCode;

@包处理器(CmdId.VerifyLoginTokenReq)
public class 处理VerifyLoginTokenReq implements 数据包处理器 {

    @Override
    public void 处理(游戏会话 会话, byte[] 数据) throws Exception {

        var req = VerifyLoginTokenReq.parseFrom(数据);

        var rsp = VerifyLoginTokenRsp.newBuilder()
                .setAccountType(req.getAccountType())
                .setDeviceUuid("abcd")
                .setIsServerOpen(true)
                .setSdkUid(req.getSdkUid())
                .setStatus(StatusCode.StatusCode_Ok)
                .setUserId(1)
                .build();

        会话.发送(CmdId.VerifyLoginTokenRsp, rsp);
    }
}
