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
                
                // 处理metarial字段
                if (ad.metarial && ad.metarial.enable === "enable") {
                    ad.metarial.enable = "disable";
                    console.log("🎨 已禁用素材");
                }
                
                // 处理spare备用广告数据
                if (ad.spare && typeof ad.spare === "object") {
                    console.log("🔄 发现备用广告数据，开始处理...");
                    
                    // 清空备用广告图片
                    if (ad.spare.img) {
                        ad.spare.img = "";
                        console.log("🖼️ 已清空备用广告图片");
                    }
                    
                    // 清空备用广告链接
                    if (ad.spare.url) {
                        ad.spare.url = "";
                        console.log("🔗 已清空备用广告链接");
                    }
                    
                    // 设置备用广告显示次数为0
                    if (ad.spare.showTimes) {
                        ad.spare.showTimes = 0;
                        console.log("📊 已设置备用广告显示次数为0");
                    }
                    
                    // 设置备用广告时长为0
                    if (ad.spare.duration) {
                        ad.spare.duration = 0;
                        console.log("⏱️ 已设置备用广告时长为0");
                    }
                    
                    // 清空备用广告追踪URL
                    if (ad.spare.show_ping_urls && Array.isArray(ad.spare.show_ping_urls)) {
                        ad.spare.show_ping_urls = [];
                        console.log("👁️ 已清空备用广告显示追踪URLs");
                    }
                    
                    if (ad.spare.click_ping_urls && Array.isArray(ad.spare.click_ping_urls)) {
                        ad.spare.click_ping_urls = [];
                        console.log("👆 已清空备用广告点击追踪URLs");
                    }
                    
                    // 清空备用广告深度链接
                    if (ad.spare.deeplink && ad.spare.deeplink.link) {
                        ad.spare.deeplink.link = "";
                        console.log("🔗 已清空备用广告深度链接");
                    }
                    
                    // 修改备用广告状态
                    if (ad.spare.status === "enable") {
                        ad.spare.status = "disable";
                        console.log("🔧 已修改备用广告状态为disable");
                    }
                }
                
                // 清空竞价追踪URL
                if (ad.bid_price_ping_urls && Array.isArray(ad.bid_price_ping_urls)) {
                    ad.bid_price_ping_urls = [];
                    console.log("💰 已清空竞价追踪URLs");
                }
                
                // 禁用客户端竞价
                if (ad.is_client_bidding === true) {
                    ad.is_client_bidding = false;
                    console.log("🚫 已禁用客户端竞价");
                }
                
                // 处理msg_style样式控制
                if (ad.msg_style && typeof ad.msg_style === "object") {
                    // 隐藏广告图片
                    if (ad.msg_style.is_hide_img !== undefined) {
                        ad.msg_style.is_hide_img = 1;
                        console.log("🖼️ 已设置隐藏广告图片");
                    }
                    
                    // 隐藏优惠券
                    if (ad.msg_style.is_show_coupons !== undefined) {
                        ad.msg_style.is_show_coupons = false;
                        console.log("🎫 已隐藏优惠券显示");
                    }
                    
                    // 隐藏图标
                    if (ad.msg_style.is_hide_icon !== undefined) {
                        ad.msg_style.is_hide_icon = true;
                        console.log("🏷️ 已隐藏广告图标");
                    }
                    
                    // 隐藏VIP入口
                    if (ad.msg_style.is_show_vip_entry !== undefined) {
                        ad.msg_style.is_show_vip_entry = 0;
                        console.log("👑 已隐藏VIP入口");
                    }
                    
                    // 重置社交互动数据
                    if (ad.msg_style.likes !== undefined) {
                        ad.msg_style.likes = 0;
                        console.log("👍 已重置点赞数为0");
                    }
                    
                    if (ad.msg_style.dislikes !== undefined) {
                        ad.msg_style.dislikes = 0;
                        console.log("👎 已重置踩数为0");
                    }
                }
                
                // 清空广告比例设置
                if (ad.ratio) {
                    ad.ratio = "";
                    console.log("📐 已清空广告比例设置");
                }
                
                // 清空广告来源标识
                if (ad.source_name) {
                    ad.source_name = "";
                    console.log("🏷️ 已清空广告来源标识");
                }
                
                // 修改状态为disable
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
