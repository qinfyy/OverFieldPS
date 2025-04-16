package cyt.kfkj.http服务器.http处理器;

import com.alibaba.fastjson2.JSON;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;
import cyt.kfkj.http服务器.数据类.登录响应;

public class 登录处理器 implements Handler {
    public void handle(@NotNull Context ctx) throws Exception {
        登录响应 响应 = new 登录响应();
        响应.setStatus(true);

        登录响应.LoginData 登录数据 = new 登录响应.LoginData();
        登录响应.LoginData.UserData 用户数据 = new 登录响应.LoginData.UserData();
        用户数据.setUid("123456");
        用户数据.setUsername("cyt");
        用户数据.setMobile("12345678901");
        用户数据.setIsGuest("0");
        用户数据.setRegDevice("text");
        用户数据.setSexType("0");
        用户数据.setCheckKey("text");
        用户数据.setIsMbUser(0);
        用户数据.setIsSnsUser(0);
        用户数据.setToken("@171@213@178@152@169@171@179");

        登录响应.LoginData.ExtInfo extInfo = new 登录响应.LoginData.ExtInfo();
        extInfo.setOauthType(0);
        extInfo.setOauthId("");
        extInfo.setAccess_token("");

        登录数据.setUserData(用户数据);
        登录数据.setAuthToken("@198@221@158@168@215@205@190@191");
        登录数据.setExtInfo(extInfo);
        登录数据.setCheckRealName(0);
        登录数据.setIsAdult(true);
        登录数据.setUAge(55);
        登录数据.setCkPlayTime(0);
        登录数据.setGuestRealName(1);
        登录数据.setId(0);
        登录数据.setMessage("");
        登录数据.setSuccessUrl("https://sdkapi-of.inutan.com/login.success?uid=123456&username=cyt&userToken=%40171%40213%40178%40152%40169%40171%40179&authToken=%40198%40221%40158%40168%40215%40205%40190%40191&timeleft=-1");

        响应.setData(登录数据);
        响应.setMessage("");

        ctx.result(JSON.toJSONString(响应));
    }
}
