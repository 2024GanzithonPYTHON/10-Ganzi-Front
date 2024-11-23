package com.apt.android

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebViewClient
import android.content.Intent
import android.net.Uri
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class WebViewActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.webview)

        webView = findViewById(R.id.webview)
        webView.webViewClient = WebViewClient()
        webView.settings.javaScriptEnabled = true

        // WebChromeClient 설정
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams
            ): Boolean {
                this@WebViewActivity.filePathCallback = filePathCallback
                val intent = fileChooserParams.createIntent()
                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: Exception) {
                    filePathCallback.onReceiveValue(null)
                    this@WebViewActivity.filePathCallback = null
                    return false
                }
                return true
            }
        }

        // 로드할 URL 설정
        webView.loadUrl("https://dwfwfht3o56cz.cloudfront.net")
    }

    private val fileChooserLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (filePathCallback == null) return@registerForActivityResult
            val data: Intent? = result.data
            val results = if (result.resultCode == RESULT_OK && data != null) {
                arrayOf(Uri.parse(data.dataString))
            } else {
                null
            }
            filePathCallback?.onReceiveValue(results)
            filePathCallback = null
        }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
