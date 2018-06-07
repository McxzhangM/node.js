#!/usr/bin/python3

# -*- coding: UTF-8 -*-//解决出现Non-ASCII character '\xe5' in file的问题
#文件格式转换
import PIL.Image
import os, sys

#参数个数：len(sys.argv)
#脚本名：    sys.argv[0]
#参数1：     sys.argv[1]
#参数2：     sys.argv[2]


print(u"脚本名：", sys.argv[0])
for i in range(1, len(sys.argv)):  #这里参数从1开始
    print(u"参数", i, sys.argv[i])

#格式转换
def convert(dir):
    # file_list = os.listdir(dir)
    # print(file_list)
    # for filename in file_list:
        # path = ''
        # path = dir+"/"+filename
        
        im = PIL.Image.open(dir)
        #裁剪图片大小宽高,(width,height,)
        #rgb_im = im.resize(0,0)
        #修改图片格式转换通道由RGBA转换为RGB
        rgb_im = im.convert('RGB')

        rgb_im.save("D:/Github/node.js/nodejsProject/webServer/upload_image_dir/"+"test2"+".jpg") #这个地方根据实际情况而定（存储图片的路径+图片名称+需要转换成的图片格式）
        im.close()

if __name__ == '__main__':
   dir = "D:/Github/node.js/nodejsProject/webServer/upload_image_dir/test00220180606162258.png"  #运行后输入要进行转换的图片的路径
   convert(dir)