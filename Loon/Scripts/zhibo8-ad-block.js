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
        
        // 如果是数组，遍历修改每个广告的状态
        if (Array.isArray(adData)) {
            adData.forEach(ad => {
                if (ad.status === "enable") {
                    ad.status = "disable";
                    console.log("✅ 广告状态已修改为disable: " + (ad.name || "未知广告"));
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
