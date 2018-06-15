#!/usr/bin/python3

# -*- coding: UTF-8 -*-//解决出现Non-ASCII character '\xe5' in file的问题
#文件格式转换
import PIL.Image
import PIL.ImageFilter
import PIL.ImageDraw
import PIL.ImageFont
import os, sys
import datetime

#参数个数：len(sys.argv)
#脚本名：    sys.argv[0]
#参数1：     sys.argv[1]
#参数2：     sys.argv[2]

#name: 待处理文件名             1
#befor_type:处理前文件类型      2
#after_type:处理后文件类型      3
#input_test:添加在图片上的文字  4
#width:宽度                    5
#height:高度                   6
#rotate:旋转度数               7
#position:文字位置             8
#color:文字颜色                9
#up_dir:上传图片文件夹路径      10
#save_dir：下载图片文件夹路径   11
#font    :字体                 12

#当前时间
nowTime = ''
up_dir = sys.argv[10]
save_dir = sys.argv[11]
font_style = sys.argv[12]

#格式转换
def convert(dir):

    im = PIL.Image.open(dir)

    #修改图片格式转换通道由RGBA转换为RGB
    rgb_im = im.convert('RGB')

    #裁剪图片大小宽高,(width,height,)
    if (sys.argv[5] and sys.argv[5] !="null") and (sys.argv[6] and sys.argv[6] !="null"):

        width = int(sys.argv[5],10)
        height= int(sys.argv[6],10)
        rgb_im = rgb_im.resize((width,height))
    
    #图片添加文字
    if sys.argv[4] and sys.argv[4] !="null" and sys.argv[8] and sys.argv[8] != "null" and sys.argv[9] and sys.argv[9] != "null":

        draw = PIL.ImageDraw.Draw(rgb_im)
        font = PIL.ImageFont.truetype(font_style,20)
        text = sys.argv[4]

        #参数处理，处理位置和颜色
        w,h = rgb_im.size
        if sys.argv[8] == 'leftTop':
            position_x,position_y = (30,30)
        elif sys.argv[8] == 'rightTop':
            position_x,position_y = (w-150,20)
        elif sys.argv[8] == 'leftBottom':
            position_x,position_y = (0,h-30)
        elif sys.argv[8] == 'rightBottom':
            position_x,position_y = (w-150,h-30)
        else:
            position_x,position_y = (w/2,h/2)

        if sys.argv[9] == 'black':
            color = (0,0,0)
        elif sys.argv[9] == 'white':
            color = (255,255,255)
        elif sys.argv[9] == 'green':
            color = (0,255,0)
        elif sys.argv[9] == 'blue':
            color = (0,0,255)
        else:
            color = (255,0,0)
        
        draw.text((position_x,position_y),text,color,font=font)

    #图片旋转
    if sys.argv[7] and sys.argv[7] !="null":

        rotate = int(sys.argv[7],10)
        rgb_im = rgb_im.rotate(rotate, expand=True)


    #这个地方根据实际情况而定（存储图片的路径+图片名称+需要转换成的图片格式）
    rgb_im.save(save_dir + nowTime+'/'+sys.argv[1]+"."+sys.argv[3])
    im.close()


#判断文件夹是否存在如不存在则创建
def makeDir():
    #获取当前时间作为文件夹名称，并判断是否已有文件夹，如果没有则创建文件夹
    global nowTime
    nowTime = datetime.datetime.now().strftime('%Y%m%d')

    dirs = save_dir + nowTime

    if not os.path.exists(dirs):
        os.makedirs(dirs)

    dir = up_dir + nowTime + "/" + sys.argv[1]+'.'+sys.argv[2]  #运行后输入要进行转换的图片的路径
    convert(dir)

if __name__ == '__main__':
   makeDir()