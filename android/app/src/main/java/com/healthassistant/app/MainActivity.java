// package com.healthassistant.app;

// import com.getcapacitor.BridgeActivity;

// public class MainActivity extends BridgeActivity {}
package com.healthassistant.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {

    @Override
    public void onBackPressed() {
        WebView webView = this.bridge.getWebView();

        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            moveTaskToBack(true);
        }
    }
}