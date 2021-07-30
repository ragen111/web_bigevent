$(function() {
    // 自定义表单校验
    layui.form.verify({
        nickname: [
            /^[\S]{2,6}$/, '昵称必须2到6位，且不能出现空格'
        ]
    })

    // 初始化用户信息
    initUserInfo();

    //重置按钮
    $('#reset').on('click', function(e) {
        e.preventDefault();
        //重新初始化用户信息
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败！');
                } else {
                    // 调用父亲index.html的js函数getUserInfo(),重新渲染头像和名称
                    window.parent.getUserInfo();
                }
            }
        })
    })
})





// 初始化用户信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('初始化用户信息失败！');
            } else {
                // 调用layui.form.val()函数为表单赋值
                layui.form.val('formUserInfo', res.data);
            }
        }
    })
}