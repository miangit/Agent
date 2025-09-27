/**
 * 直播吧主配置拦截脚本
 * 第零层屏蔽：从主配置层面禁用所有广告功能和SDK，最彻底的源头拦截
 * 版本: v1.0 - 主配置层拦截版
 */

const url = $request.url;
const method = $request.method;

// 只处理主配置API的GET请求
if (url.includes("/ios/config/") && method === "GET") {
    try {
        // 解析原始响应
        let body = $response.body;
        let mainConfig = JSON.parse(body);
        
        let disabledCount = 0;
        
        // 1. 禁用主广告开关
        if (mainConfig.advert && mainConfig.advert.enable === "true") {
            mainConfig.advert.enable = "false";
            disabledCount++;
        }
        
        // 2. 禁用详细广告配置
        if (mainConfig.advert_config) {
            const adConfigKeys = [
                'splash_bk', 'inter_bk', 'pop_bk', 'main_pop_bk', 'other_bk'
            ];
            
            adConfigKeys.forEach(key => {
                if (mainConfig.advert_config[key] === "enable") {
                    mainConfig.advert_config[key] = "disable";
                    disabledCount++;
                }
            });
            
            // 设置广告显示次数为0
            if (mainConfig.advert_config.splash_bk_show_times) {
                mainConfig.advert_config.splash_bk_show_times = 0;
            }
            if (mainConfig.advert_config.splash_bk_duration) {
                mainConfig.advert_config.splash_bk_duration = 0;
            }
            if (mainConfig.advert_config.splash_bk_duration_ms) {
                mainConfig.advert_config.splash_bk_duration_ms = 0;
            }
        }
        
        // 3. 禁用活动配置中的广告位
        if (mainConfig.advert_config && mainConfig.advert_config.activities_config) {
            mainConfig.advert_config.activities_config.forEach(activity => {
                if (activity.enable === true) {
                    activity.enable = false;
                    disabledCount++;
                }
                // 清空广告URL
                if (activity.url && activity.url.includes("allOne.php")) {
                    activity.url = "";
                }
                // 禁用广告上报
                if (activity.advert_report && activity.advert_report.enable === true) {
                    activity.advert_report.enable = false;
                }
            });
        }
        
        // 4. 清空广告SDK配置（防止SDK初始化）
        const sdkKeys = ['sdk_tanx', 'sdk_baidu', 'sdk_toutiao', 'sdk_gdt', 'sdk_kuaishou', 'sdk_klevin'];
        sdkKeys.forEach(sdkKey => {
            if (mainConfig.advert_config && mainConfig.advert_config[sdkKey]) {
                // 清空appid，让SDK无法初始化
                if (mainConfig.advert_config[sdkKey].appid) {
                    mainConfig.advert_config[sdkKey].appid = "";
                    disabledCount++;
                }
                if (mainConfig.advert_config[sdkKey].appkey) {
                    mainConfig.advert_config[sdkKey].appkey = "";
                }
                if (mainConfig.advert_config[sdkKey].appname) {
                    mainConfig.advert_config[sdkKey].appname = "";
                }
            }
        });
        
        // 5. 禁用广告相关超时和预加载
        if (mainConfig.advert_config) {
            const timeoutKeys = [
                'splash_bidding_token_timeout', 'other_bidding_token_timeout',
                'splash_sdk_timeout', 'splash_total_timeout', 'list_request_timeout'
            ];
            timeoutKeys.forEach(key => {
                if (mainConfig.advert_config[key]) {
                    mainConfig.advert_config[key] = 0;
                }
            });
            
            // 禁用WiFi预加载
            if (mainConfig.advert_config.wifi_preloading && mainConfig.advert_config.wifi_preloading.enable === "enable") {
                mainConfig.advert_config.wifi_preloading.enable = "disable";
                disabledCount++;
            }
        }
        
        // 6. 禁用IDFA相关（防止广告追踪）
        if (mainConfig.advert_config) {
            if (mainConfig.advert_config.used_idfa) {
                mainConfig.advert_config.used_idfa = 0;
            }
            if (mainConfig.advert_config.demand_ios_ext) {
                mainConfig.advert_config.demand_ios_ext = 0;
            }
        }
        
        // 输出处理结果
        if (disabledCount > 0) {
            console.log(`🚫 [直播吧主配置拦截] 已从源头禁用 ${disabledCount} 项广告配置`);
        }
        
        // 返回修改后的主配置
        const modifiedResponse = {
            body: JSON.stringify(mainConfig),
            headers: $response.headers,
            status: $response.status
        };
        
        $done(modifiedResponse);
        
    } catch (error) {
        console.log("❌ [直播吧主配置拦截] 解析失败: " + error.message);
        // 如果解析失败，返回一个禁用所有广告的最小配置
        const fallbackConfig = {
            advert: { enable: "false" },
            advert_config: {
                splash_bk: "disable",
                inter_bk: "disable", 
                pop_bk: "disable",
                main_pop_bk: "disable",
                other_bk: "disable",
                activities_config: []
            }
        };
        const fallbackResponse = {
            body: JSON.stringify(fallbackConfig),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            status: 200
        };
        $done(fallbackResponse);
    }
} else {
    // 对于其他请求，正常处理
    $done({});
}
