/**
 * 直播吧广告禁用脚本
 * 修改广告状态为disable，让app认为广告被禁用
 */

const url = $request.url;
const method = $request.method;

// 处理广告请求响应
if (url.includes("/allOne.php") && method === "POST") {
    console.log("🔧 修改直播吧广告状态: " + url);
    
    try {
        // 解析原始响应
        let body = $response.body;
        let adData = JSON.parse(body);
        
        // 如果是数组，遍历修改每个广告的关键字段
        if (Array.isArray(adData)) {
            adData.forEach(ad => {
                // 清空广告图片URL
                if (ad.img) {
                    ad.img = "";
                    console.log("🖼️ 已清空广告图片: " + (ad.name || "未知广告"));
                }
                
                // 清空广告跳转链接
                if (ad.url) {
                    ad.url = "";
                    console.log("🔗 已清空广告链接: " + (ad.name || "未知广告"));
                }
                
                // 设置显示次数为0
                if (ad.showTimes) {
                    ad.showTimes = 0;
                    console.log("📊 已设置显示次数为0: " + (ad.name || "未知广告"));
                }
                
                // 设置显示时长为0
                if (ad.duration) {
                    ad.duration = 0;
                    console.log("⏱️ 已设置显示时长为0: " + (ad.name || "未知广告"));
                }
                
                // 清空所有追踪URL
                if (ad.report_ping_urls && Array.isArray(ad.report_ping_urls)) {
                    ad.report_ping_urls = [];
                    console.log("📈 已清空上报追踪URLs");
                }
                
                if (ad.show_ping_urls && Array.isArray(ad.show_ping_urls)) {
                    ad.show_ping_urls = [];
                    console.log("👁️ 已清空显示追踪URLs");
                }
                
                if (ad.click_ping_urls && Array.isArray(ad.click_ping_urls)) {
                    ad.click_ping_urls = [];
                    console.log("👆 已清空点击追踪URLs");
                }
                
                // 清空deeplink
                if (ad.deeplink && ad.deeplink.link) {
                    ad.deeplink.link = "";
                    console.log("🔗 已清空深度链接");
                }
                
                // 修改状态为disable (备用方案)
                if (ad.status === "enable") {
                    ad.status = "disable";
                    console.log("🔧 已修改广告状态为disable");
                }
            });
        }
        
        // 返回修改后的响应
        const modifiedResponse = {
            body: JSON.stringify(adData),
            headers: $response.headers,
            status: $response.status
        };
        
        $done(modifiedResponse);
        
    } catch (error) {
        console.log("❌ 解析广告数据失败: " + error);
        // 如果解析失败，返回空数组作为备用方案
        const fallbackResponse = {
            body: JSON.stringify([]),
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
