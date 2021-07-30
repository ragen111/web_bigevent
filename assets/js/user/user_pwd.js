$(function() {
    // 自定义表单校验规则
    layui.form.verify({
        //原密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码一致';
            }
        },
        // 确认新密码
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    })

    //监听重置密码提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败');
                }
                layui.layer.msg('重置密码成功');
                //重置表单
                $('#reset').click();
                // $('.layui-form')[0].reset();

            }
        })
    })
})