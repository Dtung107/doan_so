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
source.include_exts = py,kv,java,kt,png,jpg,gif,mp4,mp3,ttf,ttc

# (str) Application versioning
version = 1.0

# (list) Application requirements
# LƯU Ý: Đã bổ sung cython phiên bản 0.29.33 để tránh lỗi biên dịch C-extensions
requirements = python3,kivy,pango,pandas,numpy

# (str) Supported orientations
orientation = portrait

# -----------------------------------------------------------------------------
# Android specific
# -----------------------------------------------------------------------------


android.api = 33

android.sdk = 33

android.minapi = 21

android.ndk_api = 21

android.ndk = 25c

android.skip_update = False

android.accept_sdk_license = True

android.permissions = INTERNET

# -----------------------------------------------------------------------------
# Buildozer section
# -----------------------------------------------------------------------------
[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warning if buildozer is run as root (0 = false, 1 = true)
warn_on_root = 1

