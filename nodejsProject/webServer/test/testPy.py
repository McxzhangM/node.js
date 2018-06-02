#!/usr/bin/python3

# -*- coding: UTF-8 -*-//解决出现Non-ASCII character '\xe5' in file的问题
#文件格式转换
import PIL.Image
import os, sys

def convert(dir):
    file_list = os.listdir(dir)
    print(file_list)
    for filename in file_list:
        path = ''
        path = dir+"/"+filename
        print(path)
        im = PIL.Image.open(path)
        rgb_im = im.convert('RGB')
        rgb_im.save("F:/MyProject/python_exempl/image2/" + "test2" + ".jpg") #这个地方根据实际情况而定（存储图片的路径+图片名称+需要转换成的图片格式）
        print ("%s has been changed!"%filename)

if __name__ == '__main__':
   dir = "F:/MyProject/python_exempl/image"  #运行后输入要进行转换的图片的路径
   convert(dir)