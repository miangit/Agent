/**
 * 直播吧广告配置拦截脚本
 * 第一层屏蔽：从配置层面禁用所有广告位，作为主配置层的补充拦截
 * 版本: v2.0 - 配置层拦截增强版
 */

const url = $request.url;
const method = $request.method;

// 只处理广告配置API的POST请求
if (url.includes("/activities/config.php") && method === "POST") {
    try {
        // 解析原始响应
        let body = $response.body;
        let configData = JSON.parse(body);
        
        // 检查是否是数组格式的配置数据
        if (Array.isArray(configData)) {
            let disabledCount = 0;
            
            // 遍历所有广告位配置，将其禁用
            configData.forEach(adConfig => {
                if (adConfig.enable === true) {
                    adConfig.enable = false;
                    disabledCount++;
                }
                
                // 禁用广告上报功能
                if (adConfig.advert_report && adConfig.advert_report.enable === true) {
                    adConfig.advert_report.enable = false;
                }
                
                // 清空广告URL（额外保险）
                if (adConfig.url && adConfig.url.includes("allOne.php")) {
                    adConfig.url = "";
                }
            });
            
            // 输出处理结果
            if (disabledCount > 0) {
                console.log(`🛡️ [直播吧配置拦截] 第一层补充拦截: 已禁用 ${disabledCount} 个广告位配置`);
            }
        }
        
        // 返回修改后的配置
        const modifiedResponse = {
            body: JSON.stringify(configData),
            headers: $response.headers,
            status: $response.status
        };
        
        $done(modifiedResponse);
        
    } catch (error) {
        console.log("❌ [直播吧配置拦截] 解析失败: " + error.message);
        // 如果解析失败，返回空配置作为备用方案
        const emptyConfigResponse = {
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            status: 200
        };
        $done(emptyConfigResponse);
    }
} else {
    // 对于其他请求，正常处理
    $done({});
}
