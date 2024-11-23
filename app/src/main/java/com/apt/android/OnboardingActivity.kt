package com.apt.android

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class OnboardingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.onboarding)

        // 이미지 클릭 시 WebViewActivity로 이동
        findViewById<View>(R.id.onboardingImage).setOnClickListener {
            startActivity(Intent(this, WebViewActivity::class.java))
            finish()
        }
    }
}
