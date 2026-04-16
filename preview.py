#!/usr/bin/env python3
"""
个人工作看板 - 本地预览服务器
在浏览器中打开 http://localhost:8000 预览效果
"""

import http.server
import socketserver
import webbrowser
import os
import sys

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头，允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # 默认显示index.html
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def main():
    # 切换到项目目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    PORT = 8000
    
    # 检查端口是否可用
    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            print(f"🚀 个人工作看板预览服务器已启动!")
            print(f"📂 项目目录: {os.getcwd()}")
            print(f"🌐 访问地址: http://localhost:{PORT}")
            print(f"📱 也可以在手机浏览器访问: http://[你的IP地址]:{PORT}")
            print("\n✨ 功能预览:")
            print("  • 销售数据图表")
            print("  • 项目管理看板（可拖拽）")
            print("  • 个人日报系统")
            print("  • 亮色/暗色主题切换")
            print("  • 响应式设计")
            print("\n🔄 按 Ctrl+C 停止服务器")
            
            # 自动在浏览器中打开
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("✅ 已尝试在默认浏览器中打开页面")
            except:
                print("⚠️  无法自动打开浏览器，请手动访问上述地址")
            
            # 启动服务器
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # 端口被占用
            print(f"❌ 端口 {PORT} 已被占用，请尝试:")
            print(f"   1. 关闭占用该端口的程序")
            print(f"   2. 使用其他端口: python preview.py 8080")
            print(f"   3. 直接双击打开 index.html 文件")
        else:
            print(f"❌ 启动服务器失败: {e}")
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
        sys.exit(0)

if __name__ == "__main__":
    # 检查是否指定了端口
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"❌ 无效的端口号: {sys.argv[1]}")
            sys.exit(1)
    else:
        PORT = 8000
    
    main()