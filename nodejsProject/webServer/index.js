/*
*主页
*/
var option = {    
    formData : new FormData(),    //模拟一个原始的表单格式的数据
    url : 'http://127.0.0.1:8888',//请求地址
    image_name_arr : [],          //暂存处理后当前图片名称，已图片名称加日期的格式暂存
    current_date   : "",           //当前系统时间
    radio_type : "",               //转换后格式
    radio_text : "",               //自定义文字
    draw_text_position:"",         //文字所处位置
    draw_color:"",                 //文字颜色
    radio_width : "",              //宽度
    radio_height: "",              //高度
    radio_rotate: ""               //旋转度数
}

var upload_image_obj = "";        //当前上传图片对象
var reads= new FileReader();      //访问本地文件，获取文件地址实现选中预览

//获取选中的文件
function changeImage(image){    
    upload_image_obj = image.files[0];

    if(upload_image_obj == undefined){
        return;
    }

    //判断文件大小是否超过5M
    if(upload_image_obj.size/(1024*1024) > 1){
        alert("上传文件大小超过1M");
        upload_image_obj ="";
        return;
    }

    //判断上传文件的格式是否为png,jpg,jpeg,bmp,webp,gif等
    if(upload_image_obj.type == "image/png"||upload_image_obj.type == "image/jpg"
    ||upload_image_obj.type == "image/jpeg"||upload_image_obj.type == "image/webp"
    ||upload_image_obj.type == "image/bmp"){
        reads.readAsDataURL(upload_image_obj);
        reads.onload=function (e) {
            $("#preview_image").attr('src',this.result);
        };
    }else{
        alert("上传文件类型不符合");
        upload_image_obj ="";
        return;
    }
    
}

//上传选中文件
function upload_image(){

    option.formData = new FormData();
    //当前是否选中了图片
    if(upload_image_obj == "" || upload_image_obj == undefined || upload_image_obj.size == 0){
        alert("请先选择图片");
        $("#upload_alert").css('display','none');
        return;
    }

    //制定图片名称，图片名+日期，传递给服务端做修改
    option.image_name_arr = upload_image_obj.name.split(".");
    option.image_name_arr[0] = option.image_name_arr[0] + new Date().format("yyyyMMddhhmmss")
    
    //添加参数图片对象，图片名称，图片类型
    option.formData.append("inputfile",upload_image_obj);
    option.formData.append("image_name",esCode(option.image_name_arr[0]));
    option.formData.append("image_type",esCode(option.image_name_arr[1]));

    //展开loading图
    $("#div_loading").css('display','block')
    //上传请求
    $.ajax({
        url: option.url + '/upload_file',
        type: 'POST',
        data : option.formData,
        processData : false,
        contentType : false,
        success:function(data){
            if(data.code == "0"){
                alert(data.data);
            }
            //清空选中图片
            $("#upload_input").val('');
            //显示已上传文字
            $("#upload_alert").css('display','inline');
            //清空上传图片对象
            upload_image_obj = "";

            //隐藏loading图
            $("#div_loading").css('display','none');
        },
        error:function(err){
            alert("上传失败");

            //隐藏loading图
            $("#div_loading").css('display','none');
            //显示已上传文字
            $("#upload_alert").css('display','none');
        }
    })
}

//下载；文件名;转换后格式；添加文字,文字位置；宽，高；旋转度数
function download_image(){

    option.radio_type =  $('#select_after_type option:selected').val();
    option.radio_text =  $('#draw_text').val();
    option.draw_text_position = $('input[name="draw_text_position"]:checked').val();
    option.draw_color = $('input[name="draw_color"]:checked').val();
    option.radio_width = $('#width').val();
    option.radio_height = $('#height').val();
    option.radio_rotate = $('input[name="rotate"]:checked').val();

    if(option.radio_type == ""){
        alert("未选择转换类型");
        return;
    }

    if(!(option.image_name_arr) || option.image_name_arr.length == 0){
        alert("未上传图片");
        return;
    }

    var url = option.url + "/download?name="+esCode(option.image_name_arr[0])+'&befor_type='+esCode(option.image_name_arr[1])+
    "&after_type="+esCode(option.radio_type)+"&input_test="+esCode(option.radio_text)+"&width="+esCode(option.radio_width)+
    "&height="+esCode(option.radio_height)+"&rotate="+esCode(option.radio_rotate)+"&position="+esCode(option.draw_text_position)+
    "&color="+esCode(option.draw_color);

    if(!!window.ActiveXObject || "ActiveXObject" in window){//判断是否为IE

        if(window.navigator.msSaveBlob){//IE10+方法

        // var blobObject = new Blob([url]); 

        //window.navigator.msSaveBlob(blobObject,option.image_name_arr[0]+'.'+option.radio_type); 
           alert('检测到您正在使用IE浏览器，可能会遇到未知的问题，建议更换浏览器');
        }
    }

    try{

        $("#home_download").attr('src',url);
    }catch(e){ 
        alert("下载异常！");
    }     
}

//格式化日期函数
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}   

//加密
function esCode(code){
    if(code == ""){
        return code;
    }
    var encryption=String.fromCharCode(code.charCodeAt(0)+code.length);  
    for(var i=1;i<code.length;i++)  
     {        
        encryption+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
    } 

    return encryption;
}
