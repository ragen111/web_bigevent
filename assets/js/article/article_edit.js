$(function() {
    //从url中获取当前文章的id
    const urlParams = new URLSearchParams(location.href.split('?')[1]);
    const id = urlParams.get('id');

    //初始化文章类别
    initArticleCate();

    // 初始化富文本编辑器
    initEditor();

    //根据id初始化表单数据
    getArticleById();

    //初始化cropper
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    //点击选择封面按钮触发file文件选择框
    $('#btnArtPic').on('click', function() {
        $('#filePic').click();
    })

    // 为file文件选择框绑定change事件
    $('#filePic').on('change', function(e) {
        //获取文件的列表数组
        var file = e.target.files;
        // 判断用户是否选择了文件
        if (file.length <= 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    //点击存为草稿按钮，改变state属性值
    $('#btnDraft').on('click', function() {
        art_state = '草稿';
    })

    //监听表单的提交事件
    $('#formEdit').on('submit', function(e) {
        e.preventDefault();
        // 用FormData对象来获取表单数据FormData
        var fd = new FormData(document.querySelector('#formEdit'));
        // 向FormData对象追加state状态值
        fd.append('state', art_state);
        // 向FormData对象追加id值
        fd.append('Id', id);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 向FormData对象追加封面blob值
                fd.append('cover_img', blob);
                //根据 Id 更新文章信息
                // 此方法要在这个回调函数内调用
                //若在这个回调函数外调用，会先执行updateArticleById(fd)函数，此时fd内'cover_img'还未赋值
                updateArticleById(fd);
            });
    })

    // 根据 Id 更新文章信息
    function updateArticleById(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            //提交formdata数据必须写以下两个配置项
            contentType: false,
            processData: false,
            data: fd,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改文章失败');
                }
                layui.layer.msg('修改文章成功');
                location.href = '/08/article/article_list.html';
            }
        })
    }

    //根据 Id 获取文章详情，并初始化表单数据
    function getArticleById() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取当前文章信息失败');
                }
                // console.log(res);
                layui.form.val('formEdit', res.data);
                //  初始化裁剪区域
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img) // 重新设置图片路径
                    .cropper(options); // 重新初始化裁剪区域
            }
        })
    }


    //初始化文章类别
    function initArticleCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败');
                }
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                // 让layui重新渲染表单
                layui.form.render();
            }

        })
    }

})