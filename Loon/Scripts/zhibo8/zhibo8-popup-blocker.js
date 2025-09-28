/*
 * 直播吧弹窗屏蔽脚本
 * 版本: 1.0.0
 * 作者: Assistant
 * 描述: 屏蔽直播吧app的更新弹窗、通知弹窗等各种烦人的弹窗提示
 * 
 * 支持的弹窗类型:
 * - 版本更新弹窗
 * - 推送通知弹窗
 * - 登录提示弹窗
 * - 隐私政策弹窗
 * - 实时比分推送弹窗
 * - 关注主播弹窗
 */

// 获取响应体
let body = $response.body;
let url = $request.url;

try {
    let data = JSON.parse(body);
    let isModified = false;

    // 处理版本检查接口 (a.qiumibao.com/ios/)
    if (url.includes('/ios/') && !url.includes('/config/')) {
        console.log('🚫 [弹窗屏蔽] 拦截版本检查接口');
        
        if (data.update) {
            data.update = "stop";  // 停止更新提示
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用版本更新提示');
        }
        
        if (data.tip) {
            data.tip = "false";    // 禁用提示显示
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用更新提示弹窗');
        }
        
        // 清空更新信息，避免显示更新内容
        if (data.info) {
            data.info = "";
            isModified = true;
        }
    }

    // 处理全局配置接口 (a.qiumibao.com/ios/config/)
    else if (url.includes('/ios/config/')) {
        console.log('🚫 [弹窗屏蔽] 拦截全局配置接口');
        
        // 禁用各种提示弹窗
        if (data.tip) {
            // 禁用升级提示弹窗
            if (data.tip.upgrade) {
                data.tip.upgrade.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用升级提示弹窗');
            }
            
            // 禁用推送通知提示弹窗
            if (data.tip.push_score) {
                data.tip.push_score.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用推送通知弹窗');
            }
            
            // 禁用语音播报提示弹窗
            if (data.tip.push_voice) {
                data.tip.push_voice.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用语音播报弹窗');
            }
            
            // 禁用隐私政策弹窗
            if (data.tip.privacy) {
                data.tip.privacy.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用隐私政策弹窗');
            }
            
            // 禁用实名认证弹窗
            if (data.tip.real_name) {
                data.tip.real_name.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用实名认证弹窗');
            }
            
            // 禁用竞猜推广弹窗
            if (data.tip.guess) {
                data.tip.guess.enable = "disable";
                if (data.tip.guess.my_channel) {
                    data.tip.guess.my_channel.recommend_pop = "disable";
                }
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用竞猜推广弹窗');
            }
            
            // 禁用关注主播弹窗
            if (data.tip.attention_anchor) {
                data.tip.attention_anchor.enable = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用关注主播弹窗');
            }
        }
        
        // 禁用用户登录弹窗
        if (data.user && data.user.login) {
            if (data.user.login.login_pop) {
                data.user.login.login_pop = "disable";
                isModified = true;
                console.log('✅ [弹窗屏蔽] 已禁用登录提示弹窗');
            }
        }
        
        // 禁用登录引导弹窗
        if (data.user && data.user.login_guide) {
            data.user.login_guide.enable = "disable";
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用登录引导弹窗');
        }
        
        // 禁用青少年模式提醒
        if (data.teen_mode && data.teen_mode.index_alert) {
            data.teen_mode.index_alert.enable = false;
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用青少年模式提醒');
        }
        
        // 禁用更新进程弹窗
        if (data.update_process) {
            data.update_process.enable = "disable";
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用更新进程弹窗');
        }
        
        // 禁用头条引导弹窗
        if (data.headline_guide) {
            data.headline_guide.enable = "disable";
            // 设置极长的间隔，相当于禁用
            data.headline_guide.bbs_interval = 999999999;
            data.headline_guide.jian_interval = 999999999;
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用头条引导弹窗');
        }
        
        // 禁用顶部导航提示
        if (data.top_nav && data.top_nav.main_recommend && data.top_nav.main_recommend.tip) {
            data.top_nav.main_recommend.tip.flag = false;
            data.top_nav.main_recommend.notify_flag = false;
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用顶部导航提示');
        }
        
        // 禁用黑名单功能弹窗提示
        if (data.blacks && data.blacks.favor_pop) {
            data.blacks.favor_pop.enable = "disable";
            isModified = true;
            console.log('✅ [弹窗屏蔽] 已禁用黑名单功能弹窗');
        }
    }

    // 如果有修改，返回修改后的数据
    if (isModified) {
        body = JSON.stringify(data);
        console.log('🎯 [弹窗屏蔽] 弹窗屏蔽处理完成');
    } else {
        console.log('ℹ️ [弹窗屏蔽] 无需处理的接口或无弹窗配置');
    }

} catch (error) {
    console.log('❌ [弹窗屏蔽] JSON解析失败:', error.message);
}

$done({ body });
