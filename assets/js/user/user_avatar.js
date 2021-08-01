$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $('#image').cropper(options);



    // 为上传按钮绑定点击事件
    $('#changePic').on('click', function() {
        $('#file').click();
    })

    $('#file').on('change', function(e) {
        var filelist = e.target.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layui.layer.msg('获取头像失败')
        }
        var file = filelist[0];
        var newImgURL = URL.createObjectURL(file);
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为确定上传按钮绑定点击事件，将头像上传服务器，并重新渲染头像
    $('#sure').on('click', function() {
        console.log(222);
        var dataURL = $('#image')
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //将头像上传服务器，并重新渲染头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('上传头像失败！');
                }
                layui.layer.msg('上传头像成功');
                window.parent.getUserInfo();
            }
        })
    })


})