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
    radio_width : "",              //宽度
    radio_height: "",              //高度
    radio_rotate: ""               //旋转度数
}

var upload_image_obj = "";        //当前上传图片对象
var reads= new FileReader();      //访问本地文件，获取文件地址实现选中预览

//获取选中的文件
function changeImage(image){    
    upload_image_obj = image.files[0];

    console.log(upload_image_obj);

    //判断文件大小是否超过1M
    if(upload_image_obj.size/1024 > 1){
        
    }

    //判断上传文件的格式是否为png,jpg,jpeg,bmp,webp,gif等


    reads.readAsDataURL(upload_image_obj);
    reads.onload=function (e) {
        $("#preview_image").attr('src',this.result);
    };
}

//获取可选项中的选项值
function getOptionValue(){
   option.radio_type =  $('input[name="type"]:checked').val();
   option.radio_text =  $('input[name="text"]:checked').val();
   option.radio_width = $('input[name="width"]:checked').val();
   option.radio_height = $('input[name="height"]:checked').val();
   option.radio_rotate = $('input[name="rotate"]:checked').val();
}

//上传选中文件
function upload_image(){

    //当前是否选中了图片
    if(upload_image_obj == "" || upload_image_obj == undefined || upload_image_obj.size == 0){
        return;
    }

    //制定图片名称，图片名+日期，传递给服务端做修改
    option.image_name_arr = upload_image_obj.name.split(".");
    option.image_name_arr[0] = option.image_name_arr[0] + new Date().format("yyyyMMddhhmmss")

    //添加参数图片对象，图片名称，图片类型
    option.formData.append("inputfile",upload_image_obj);
    option.formData.append("image_name",option.image_name_arr[0]);
    option.formData.append("image_type",option.image_name_arr[1]);
    
    //上传请求
    $.ajax({
        url: option.url + '/upload_file',
        type: 'POST',
        data : option.formData,
        async : false,
        processData : false,
        contentType : false,
        success:function(data){
            console.log("success");
            $("#upload_input").val('');
        },
        error:function(err){
            console.log(err);
        }
    })
}

//下载；文件名;转换后格式；添加文字；宽，高；旋转度数
function download_image(){

    getOptionValue();
    try{
        var url = option.url + "/download?name="+option.image_name_arr[0]+'&befor_type='+option.image_name_arr[1]+
        "&after_type="+option.radio_type+"&input_test="+option.radio_text+"&width="+option.radio_width+
        "&height="+option.radio_height+"&rotate="+option.radio_rotate;

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