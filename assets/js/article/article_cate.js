$(function() {
    // 获取文章类别
    getArticleCate();

    //layer弹出层索引
    var index = null;
    // 为添加类别按钮绑定点击事件
    $('.addCate').on('click', function() {
        index = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#addCate_Content').html()
        })
    })

    // 通过代理的形式来监听添加类别表单的提交事件
    $('body').on('submit', '.addCate_form', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('添加类别失败');
                }
                layui.layer.msg('添加类别成功');
                // 重新加载文章类别
                getArticleCate();
                // 关闭弹出层
                layui.layer.close(index);
            }
        })
    })

    var indexEdit = null;
    // 通过代理的形式为编辑类别按钮绑定点击事件
    $('body').on('click', '.editBtn', function() {
        indexEdit = layui.layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#addCate_edit').html()
        })

        // 当前的文章类别id
        var id = $(this).attr('data-id');
        // console.log(id);
        // 根据 Id 获取文章分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取当前文章类别失败');
                }
                // layui.form.val()函数快速渲染表单
                layui.form.val('edit', res.data);
            }
        })

    })

    // 通过代理的形式来监听编辑类别表单的提交事件
    $('body').on('submit', '.form_edit', function(e) {
        e.preventDefault();
        // 根据 Id 更新文章分类数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改类别失败');
                }
                layui.layer.msg('修改类别成功');
                // 重新加载文章类别
                getArticleCate();
                // 关闭弹出层
                layui.layer.close(indexEdit);
            }
        })
    })

    // 通过代理的形式为编辑类别按钮绑定点击事件
    $('body').on('click', '.editDelete', function() {
        var id = $(this).attr('data-id');
        //弹出提示框
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除当前文章类别失败');
                    }
                    // 重新加载文章类别
                    getArticleCate();
                    layui.layer.close(index);
                }
            })
        })

    })

})

// 获取文章类别
function getArticleCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取文章类别失败');
            }
            // 调用template模板引擎
            var str = template('tpl', res);
            // 渲染文章类别数据
            $('tbody').html(str);
        }
    })
}