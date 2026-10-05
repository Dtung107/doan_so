[app]

# (str) Title of your application
title = Game Quay So

# (str) Package name
package.name = quaysogame

# (str) Package domain (needed for android/ios packaging)
package.domain = org.quaysogame

# (str) Source code where the main.py live
source.dir = .

# (list) Source files to include (process one by one)
source.include_exts = py,png,jpg,kv,atlas

# (str) Application versioning
version = 1.0

# (list) Application requirements
# LƯU Ý: Đã bổ sung cython phiên bản 0.29.33 để tránh lỗi biên dịch C-extensions
requirements = python3,kivy==2.3.0,cython==0.29.33

# (str) Supported orientations
orientation = portrait

# -----------------------------------------------------------------------------
# Android specific
# -----------------------------------------------------------------------------

# (int) Target Android API
android.api = 33

# (int) Minimum API supported
android.minapi = 21

# (str) Android NDK version to use
# Để trống hoặc dùng bản stable chuẩn số để Buildozer tự động quản lý tốt nhất
android.ndk = 25.2.9519653

# (bool) Use --skip-update-argument to skip p4a's android update
android.skip_update = False

# (bool) Accept SDK license automatically
android.accept_sdk_license = True

# (list) Permissions
android.permissions = INTERNET

# -----------------------------------------------------------------------------
# Buildozer section
# -----------------------------------------------------------------------------
[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warning if buildozer is run as root (0 = false, 1 = true)
warn_on_root = 1

