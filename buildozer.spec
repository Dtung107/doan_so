[app]

# (str) Title of your application
title = Game Quay So

# (str) Package name
package.name = quaysogame

# (str) Package domain (needed for android/ios packaging)
package.domain = org.quaysogame

source.dir = .
source.include_exts = py,png,jpg,kv,atlas

version = 1.0
requirements = python3,kivy

orientation = portrait

# Android specific
android.api = 31
android.minapi = 21
android.ndk = 25b
android.permissions = INTERNET
android.accept_sdk_license = True
[buildozer]
log_level = 2
warn_on_root = 1
