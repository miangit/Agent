/**
 * 直播吧多重广告屏蔽脚本
 * 智能检测并屏蔽各类广告，支持开屏、内页、评论区等多种广告位
 * 版本: v2.0 - 优化版
 */

// 处理单个广告对象的函数
function processAdObject(ad) {
    // 清空核心广告数据
    if (ad.img) ad.img = "";
    if (ad.url) ad.url = "";
    if (ad.showTimes) ad.showTimes = 0;
    if (ad.duration) ad.duration = 0;
    
    // 清空所有追踪URL
    if (ad.report_ping_urls && Array.isArray(ad.report_ping_urls)) ad.report_ping_urls = [];
    if (ad.show_ping_urls && Array.isArray(ad.show_ping_urls)) ad.show_ping_urls = [];
    if (ad.click_ping_urls && Array.isArray(ad.click_ping_urls)) ad.click_ping_urls = [];
    
    // 清空深度链接和禁用素材
    if (ad.deeplink && ad.deeplink.link) ad.deeplink.link = "";
    if (ad.metarial && ad.metarial.enable === "enable") ad.metarial.enable = "disable";
    
    // 处理spare备用广告数据
    if (ad.spare && typeof ad.spare === "object") {
        if (ad.spare.img) ad.spare.img = "";
        if (ad.spare.url) ad.spare.url = "";
        if (ad.spare.showTimes) ad.spare.showTimes = 0;
        if (ad.spare.duration) ad.spare.duration = 0;
        if (ad.spare.show_ping_urls && Array.isArray(ad.spare.show_ping_urls)) ad.spare.show_ping_urls = [];
        if (ad.spare.click_ping_urls && Array.isArray(ad.spare.click_ping_urls)) ad.spare.click_ping_urls = [];
        if (ad.spare.deeplink && ad.spare.deeplink.link) ad.spare.deeplink.link = "";
        if (ad.spare.status === "enable") ad.spare.status = "disable";
    }
    
    // 清空竞价相关
    if (ad.bid_price_ping_urls && Array.isArray(ad.bid_price_ping_urls)) ad.bid_price_ping_urls = [];
    if (ad.is_client_bidding === true) ad.is_client_bidding = false;
    
    // 处理msg_style样式控制
    if (ad.msg_style && typeof ad.msg_style === "object") {
        if (ad.msg_style.is_hide_img !== undefined) ad.msg_style.is_hide_img = 1;
        if (ad.msg_style.is_show_coupons !== undefined) ad.msg_style.is_show_coupons = false;
        if (ad.msg_style.is_hide_icon !== undefined) ad.msg_style.is_hide_icon = true;
        if (ad.msg_style.is_show_vip_entry !== undefined) ad.msg_style.is_show_vip_entry = 0;
        if (ad.msg_style.likes !== undefined) ad.msg_style.likes = 0;
        if (ad.msg_style.dislikes !== undefined) ad.msg_style.dislikes = 0;
    }
    
    // 清空其他标识和配置
    if (ad.ratio) ad.ratio = "";
    if (ad.source_name) ad.source_name = "";
    if (ad.model) ad.model = "";
    if (ad.shop) ad.shop = "";
    if (ad.pre_request_sdks && Array.isArray(ad.pre_request_sdks)) ad.pre_request_sdks = [];
    if (ad.autoplay !== undefined) ad.autoplay = false;
    if (ad.detail_mark) ad.detail_mark = "";
    
    // 处理ban配置
    if (ad.ban && typeof ad.ban === "object") {
        ad.ban.img = [];
        ad.ban.url = [];
        ad.ban.words = [];
        ad.ban.secret_words = "";
    }
    
    // 修改状态为disable
    if (ad.status === "enable") ad.status = "disable";
}

const url = $request.url;
const method = $request.method;

// 只处理广告API的POST请求
if (url.includes("/allOne.php") && method === "POST") {
    try {
        // 解析原始响应
        let body = $response.body;
        let adData = JSON.parse(body);
        
        // 检查是否包含关键广告标识，如果是则直接返回空数组
        if (Array.isArray(adData) && adData.length > 0) {
            const firstAd = adData[0];
            const isDefinitelyAd = (
                firstAd.shop === "tanx_bid_sdk" ||
                firstAd.model === "sdk_tanx" ||
                firstAd.type === "tanx_na_feed" ||
                (firstAd.spare && firstAd.spare.shop === "jd-rtb") ||
                firstAd.name?.includes("tanx_bid_sdk") ||
                firstAd.name?.includes("jd-rtb")
            );
            
            if (isDefinitelyAd) {
                console.log("🚫 [直播吧去广告] 激进屏蔽: " + (firstAd.name || firstAd.type || "未知广告"));
                const emptyResponse = {
                    body: JSON.stringify([]),
                    headers: $response.headers,
                    status: $response.status || 200
                };
                $done(emptyResponse);
                return;
            }
        }
        
        // 如果是数组，遍历处理每个广告对象
        if (Array.isArray(adData)) {
            adData.forEach(processAdObject);
            
            // 只输出处理结果摘要
            if (adData.length > 0) {
                console.log(`✅ [直播吧去广告] 字段修改模式: 处理了 ${adData.length} 个广告`);
            }
        }
        
        // 返回修改后的响应
        const modifiedResponse = {
            body: JSON.stringify(adData),
            headers: $response.headers,
            status: $response.status
        };
        
        $done(modifiedResponse);
        
    } catch (error) {
        console.log("❌ [直播吧去广告] 解析失败: " + error.message);
        // 解析失败时返回空数组作为备用方案
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
