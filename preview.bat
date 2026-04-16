@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   个人工作看板 - 本地预览服务器
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Python，请先安装Python 3.x
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 检查是否在正确的目录
if not exist "index.html" (
    echo ❌ 未找到index.html文件
    echo 请确保在personal-work-dashboard目录中运行此脚本
    pause
    exit /b 1
)

echo ✅ 检测到Python: 
python --version
echo.
echo 🚀 正在启动预览服务器...
echo 📂 项目目录: %cd%
echo 🌐 访问地址: http://localhost:8000
echo.
echo ✨ 功能预览:
echo   • 销售数据图表
echo   • 项目管理看板（可拖拽）
echo   • 个人日报系统
echo   • 亮色/暗色主题切换
echo   • 响应式设计
echo.
echo 🔄 按 Ctrl+C 停止服务器
echo.

REM 启动Python服务器
python preview.py

if errorlevel 1 (
    echo.
    echo ⚠️  服务器启动失败，尝试备用方案...
    echo 📄 可以直接双击打开 index.html 文件预览
    pause
)