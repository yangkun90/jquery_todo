(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
        task_list = [],
        $task_detail_mask = $('.task-detail-mask'),
        $task_detail = $('.task-detail')
    init()
    $form_add_task.on('submit', function (e) {
        var new_task = {}
        //默认行为禁止
        e.preventDefault();
        new_task.content = $(this).find('input[name=content]').val()
        new_task.date=new Date().getTime();
        new_task.complate=false
        if (!new_task.content) return;
        if (add_task(new_task)) {
            $(this).find('input[name=content]').val('')
        }
    })
    //委托方式解决预添加元素
    $('.task-list').on('click', '.anchor.delete', function () {
        var data = $(this).parents('.task-item').data()

        $.confirm({
            theme:'supervan',
            title:"确定是否删除?",
            content:'是否删除日志',
            closeIcon:true,
            animation:'scale',
            buttons:{
                ok:{
                    text:'确定',
                    action:function () { 
                        delete_task(data.index)
                     }
                },
                cancel:{
                    text:'取消'
                }
            }
        })
    })
    $('.task-list').on('click', '.anchor.detail', function () {
        var data = $(this).parents('.task-item').data('index')
        show_task_detail(data)
    })
    $task_detail.on('submit', 'form', function (e) {
        e.preventDefault()
        var textarea=$(this).find('textarea').val();
        var date=$(this).find('input[type=date]').val();
        var index=$(this).find('button').data('index');
        update_task(index,{textarea,date});  
    })
    $('.task-list').on('click','.complete',function () { 
        var index=$(this).data('index')
        if($(this).is(':checked'))
        {
            task_list[index].complate=true;
        }else{
            task_list[index].complate=false;
        }
        refresh_task_list()
     });
    $task_detail_mask.on('click', hide_task_detail)
    function update_task(index,data) { 
        task_list[index].content=data.textarea
        task_list[index].date=new Date().getTime()
        refresh_task_list()
        hide_task_detail()
     }
    function show_task_detail(index) {
        render_task_detail(index);
        $task_detail_mask.show();
        $task_detail.show()
    }

    function hide_task_detail() {
        $task_detail_mask.hide();
        $task_detail.hide()
    }

    function render_task_detail(index) {
        var year=new Date(task_list[index].date).getFullYear();
        var month=new Date(task_list[index].date).getMonth()+1;
        var day=new Date(task_list[index].date).getDate();
        var shi=new Date(task_list[index].date).getHours();
        var fen=new Date(task_list[index].date).getMinutes(); 
        var tpl = `<form><div class="content">${task_list[index].content}</div>
        <div class="input-item">
            <div  class="desc">
                <textarea name="desc" id="" >${task_list[index].content}</textarea>
            </div>
        </div>
        <div class="remind" class="input-item">
            <input class="datetime" type="text" name="date" value="${year+'年'+month+'月'+day+'日'}">
        </div>
        <div class="input-item"><button type="submit" data-index="${index}">更新</button></div>
        </form>`
        $task_detail.html(tpl)
    }

    function add_task(new_task) {
        task_list.push(new_task);
        refresh_task_list();
        return true;
    }
    //跟新列数组和渲染dom
    function refresh_task_list() {
        store.set('task_list', task_list)
        render_task_list()
    }

    function delete_task(index) {
        if (index === undefined) return
        task_list.splice(index, 1);
        refresh_task_list()
    }

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list()
        }
    }

    function render_task_list() {
        var str = '';
        console.log(task_list);
        task_list.sort(function (a,b) { 
            return b.date-a.date;
        })
        task_list.map(function (item, index) {
            return str += render_task_tpl(item, index)
        })
        $('.task-list').empty().append(str);
    }

    function render_task_tpl(data, index) {
        if (!data || index === undefined) return '';
        var isCheck=data.complate
        var str=isCheck ? 'checked':'';
        var list_item_tpl = ` <div class="task-item ${str}" data-index="${index}">
        <span><input ${str} data-index="${index}" type="checkbox" class="complete"></span>
        <span class="task-content">${data.content}</span>
        <span class="fr">
        <span class="anchor delete"> 删除</span>
        <span class="anchor detail"> 详细</span>
        </span>
        </div>`;
        return list_item_tpl;
    }
})()