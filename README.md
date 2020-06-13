# 文件管理系统（仿百度网盘）

## 演示网站
[网站地址](http://www.qiwenshare.com)
[介绍说明](http://www.qiwenshare.com/essay/detail/24)

## 介绍
基于springboot + vue 框架开发的Web文件系统，旨在为用户提供一个简单、方便的文件存储方案，目前已经完成了主要的基础功能，能够以完善的目录结构体系，对文件进行管理 。

 **您可以在其基础上继续进行开发来完善其功能，成为本项目的贡献者之一** 

 **您也可以以该项目作为脚手架，进行其他项目的开发** 

## 功能
#### 用户操作
1. 用户的登录和注册
#### 文件操作
1. 用户可对目录结构进行增加，删除，修改 
2. 提供文件的上传，下载，部分文件可在线预览 
3. 支持对zip文件的在线解压缩 
4. 支持文件和目录的移动和复制 
5. 多文件格式分类查看 
6. 图片预览支持放大、缩小、旋转，提供列表视图、网格视图、时间线视图三种查看模式
7. ...

## 软件架构
该项目采用前后端分离的方式进行开发和部署,主要用到以下关键技术

**前台**：elementui，vue,  swipper， nodejs， webpack

**后台框架**：springboot mybatis jpa

**数据结构**：递归算法，树的遍历和插入...


## 安装教程

1. 拉取代码: git clone https://gitee.com/qiwen-cloud/qiwen-file-web.git 或下载 zip 包，master 分支现在功能可用（lombok分支现为开发阶段，尚不可用）
2. 依赖安装：npm install
3. 运行: npm run serve 浏览器中输入localhost: 8080(端口若已被占用，自动加1，即8081)即可看到界面了
4. 打包: 打开 /public/config.json，修改 baseUrl 为后台服务器的IP+端口，保存，执行 npm run build
5. 部署: 打包后会生成文件夹 dist，将 dist 文件夹下的文件放置于 nginx/html 目录下，并配置 nginx/conf/nginx.conf，具体配置如下（不明白的小伙伴可以加入  **奇文社区QQ群：586207287**  共同探讨）：

```
 server {
        listen       80;
		server_name localhost;   #将localhost修改为您证书绑定的域名，例如：www.example.com。

        location / {
            root   html;
            index  index.html index.htm;
			try_files	$uri $uri/ /index.html; #可以防止页面刷新404
        }

		location /api/{
			#proxy_set_hearder host                $host;
			#proxy_set_header X-forwarded-for $proxy_add_x_forwarded_for;
			#proxy_set_header X-real-ip           $remote_addr;
			
			# 配置此处用于获取客户端的真实IP
			proxy_set_header Host $http_host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
			proxy_pass	http://localhost:8080/;
		}
       
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```
6. 文件默认保存位置：如果你是用IDEA启动的，默认保存位置在target下的upload；如果是打包成jar部署在服务器，默认保存位置在根目录的release/static/upload 下

## 使用说明

本项目仅为前端代码，运行时需要启动后台程序
后台可以访问该地址进行拉取,后端代码源码：[源码](https://gitee.com/qiwen-cloud/qiwen-file)




## 部分功能演示截图
 **主页**  :yellow_heart: 
![新版主页](https://images.gitee.com/uploads/images/2020/0409/182847_8f60ac83_1837873.png "屏幕截图.png")

![新功能](https://images.gitee.com/uploads/images/2020/0409/183222_fa2282c6_1837873.png "屏幕截图.png")

![左侧菜单栏收缩](https://images.gitee.com/uploads/images/2020/0409/183644_a6902a69_1837873.png "屏幕截图.png")

 **创建文件夹**  :blue_heart: 
![输入图片说明](https://images.gitee.com/uploads/images/2019/1022/205531_b3bf3380_947714.png "屏幕截图.png")
 **操作列展示**  :purple_heart: 
![操作列扩展](https://images.gitee.com/uploads/images/2020/0409/183336_ab936775_1837873.png "屏幕截图.png")

![操作列合并](https://images.gitee.com/uploads/images/2020/0409/183412_6a3ed5e0_1837873.png "屏幕截图.png")
 **文件的复制和移动**  :heart: 
![输入图片说明](https://images.gitee.com/uploads/images/2019/1022/210106_d4b619f3_947714.png "屏幕截图.png")
 **文件在线解压缩**  :green_heart: 
![输入图片说明](https://images.gitee.com/uploads/images/2019/1022/210214_c00f5600_947714.png "屏幕截图.png")
 **图片提供多种查看模式，列表、网格、时间线试图。可在线预览、保存、旋转、放大、缩小**  :green_heart: 
![列表](https://images.gitee.com/uploads/images/2020/0414/191341_33c094b3_1837873.png "屏幕截图.png")

![网格](https://images.gitee.com/uploads/images/2020/0414/191318_1976cf24_1837873.png "屏幕截图.png")

![时间线](https://images.gitee.com/uploads/images/2020/0414/191402_b327f036_1837873.png "屏幕截图.png")

![图片预览及操作按钮组](https://images.gitee.com/uploads/images/2020/0415/002932_c59a0baa_1837873.png "readme.png")

## 联系我
各种问题可扫描加入QQ群进行咨询

**QQ交流群**请扫描下面二维码

<img width="30%" src="https://images.gitee.com/uploads/images/2020/0406/164832_5121dc5e_947714.png"/>

**微信公众号**请扫描下面二维码

<img width="30%" src="https://images.gitee.com/uploads/images/2020/0406/164833_d99e92ee_947714.png"/>

## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


## 码云特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5.  码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)

