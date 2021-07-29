$(function() {
    // 点击注册的链接
    $('#link-reg').on('click', function() {
        $('#form-login').hide();
        $('#form-reg').show();
    })

    // 点击登录的链接
    $('#link-login').on('click', function() {
        $('#form-login').show();
        $('#form-reg').hide();
    })

    //自定义校验规则
    var form = layui.form;
    form.verify({
        //密码校验
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        //重复密码校验
        repwd: function(value) {
            if ($('#form-reg [name=password]').val() !== value) {
                return '两次密码不一致'
            }
        }
    })

    //使用layer弹层组件
    var layer = layui.layer;

    //监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        //提交的数据
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }

        //访问用户注册接口
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                layer.msg(res.message + ',请登录');
                $('#link-login').click();
            }
        })

    })

    //监听登录表单的提交事件
    $('#form-login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        //访问用户登录接口
        $.post('/api/login', $(this).serialize(), function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                layer.msg(res.message);
                //保存token到本地存储
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })

    })
})