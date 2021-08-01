$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //向服务器发送的参数
    var q = {
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 3,
        // 文章分类的 Id	
        cate_id: '',
        // 文章的状态，可选值有：已发布、草稿
        state: ''
    }

    //定义时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        var t = new Date(data);
        var y = Z(t.getFullYear());
        var m = Z(t.getMonth() + 1);
        var d = Z(t.getDay());
        var hh = Z(t.getHours());
        var mm = Z(t.getMinutes());
        var ss = Z(t.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

    }

    // 获取文章列表
    getArticleList();

    //初始化筛选区域的文章类别
    initArticleCate();

    // 为筛选表单绑定提交事件
    $('#form-filter').on('submit', function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // 根据筛选的数据q来重新获取文章列表
        getArticleList();
    })

    // 用代理的方式为删除按钮绑定点击事件
    $('body').on('click', '.editDelete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {

            // 根据 Id 删除文章数据
            deleteArticleById(id);
            //关闭弹出层
            layer.close(index);
        });
    })

    // 用代理的方式为编辑按钮绑定点击事件
    $('body').on('click', '.editBtn', function() {
        var id = $(this).attr('data-id');
        // 跳转到文章编辑页面
        location.href = '/08/article/article_edit.html?id=' + id;
        // location.href = '/08/article/article_edit.html';

    })



    // 获取文章列表
    function getArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 调用template模板引擎
                var str = template('tpl-list', res);
                // 渲染文章类别数据
                $('tbody').html(str);
                //渲染分页结构
                renderPage(res.total);

            }
        })
    }

    //补零函数
    function Z(data) {
        return data < 10 ? '0' + data : data;
    }


    //初始化筛选区域的文章类别
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

    //渲染分页结构
    function renderPage(total) {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'page', //分页容器的id
            count: total, //数据总数
            limit: q.pagesize, //每页的条数
            curr: q.pagenum, //当前页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页切换时调用jump函数
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    getArticleList();
                }
            }
        });
    }


    // 根据 Id 删除文章数据
    function deleteArticleById(id) {
        var len = $('.editDelete').length;
        // console.log(len);
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('删除文章失败');
                }
                layui.layer.msg('删除文章成功');
                if (len === 1) {
                    //此时页面只有一条数据，且已经被服务器删除
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                }
                // 重新获取文章列表
                getArticleList();
            }

        })
    }
})