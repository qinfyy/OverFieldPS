package cyt.kfkj.http服务器.数据类;

import lombok.Data;

@Data
public class 登录响应 {
    private Boolean status;
    private LoginData data;
    private String message;

    @Data
    public static class LoginData {
        private UserData userData;
        private String authToken;
        private ExtInfo extInfo;
        private Integer checkRealName;
        private Boolean isAdult;
        private Integer uAge;
        private Integer ckPlayTime;
        private Integer guestRealName;
        private Integer id;
        private String message;
        private String successUrl;

        @Data
        public static class UserData {
            private String uid;
            private String username;
            private String mobile;
            private String isGuest;
            private String regDevice;
            private String sexType;
            private String checkKey;
            private Integer isMbUser;
            private Integer isSnsUser;
            private String token;
        }

        @Data
        public static class ExtInfo {
            private Integer oauthType;
            private String oauthId;
            private String access_token;
        }
    }
}