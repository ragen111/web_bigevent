$(function() {
    getUserInfo();

    //退出主页
    $('#tuichu').on('click', function() {
        layui.layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function(index) {
            //清空本地存储的token
            localStorage.removeItem('token');
            // 跳转到登录界面
            location.href = '/08/login.html';
            // 关闭confirm框
            layer.close(index);
        });
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败！');
            } else {
                renderAvatar(res.data);
            }
        }
    })
}


//渲染用户头像和名称
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.textPic').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.textPic').html(first).show();
    }


}