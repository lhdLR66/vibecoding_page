#!/bin/bash

echo ""
echo "========================================"
echo "  个人工作看板 - 本地预览服务器"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 未检测到Python3，请先安装Python 3.x"
    echo "   macOS: brew install python"
    echo "   Ubuntu/Debian: sudo apt install python3"
    echo "   CentOS/RHEL: sudo yum install python3"
    exit 1
fi

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 未找到index.html文件"
    echo "请确保在personal-work-dashboard目录中运行此脚本"
    exit 1
fi

echo "✅ 检测到Python:"
python3 --version
echo ""
echo "🚀 正在启动预览服务器..."
echo "📂 项目目录: $(pwd)"
echo "🌐 访问地址: http://localhost:8000"
echo ""
echo "✨ 功能预览:"
echo "  • 销售数据图表"
echo "  • 项目管理看板（可拖拽）"
echo "  • 个人日报系统"
echo "  • 亮色/暗色主题切换"
echo "  • 响应式设计"
echo ""
echo "🔄 按 Ctrl+C 停止服务器"
echo ""

# 启动Python服务器
python3 preview.py

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  服务器启动失败，尝试备用方案..."
    echo "📄 可以直接用浏览器打开 index.html 文件预览"
    echo "   open index.html  # macOS"
    echo "   xdg-open index.html  # Linux"
    echo "   start index.html  # Windows (Git Bash)"
fi