new Vue({
    el : '#app',
    components:{
        'my-home':homeModel
    },
    data (){
        return{
        }
    },

    methods:{
        searchClick:function(){
            var serarch_text = $('#search_text').val();
            alert(serarch_text);
        }
    }
});