package ch.rasc.push;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import de.bytefish.fcmjava.http.options.IFcmClientSettings;

@ConfigurationProperties(prefix = "fcm")
@Component
public class FcmSettings implements IFcmClientSettings {
	private String apiKey;

	private String url;

	@Override
	public String getApiKey() {
		return this.apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String getFcmUrl() {
		return this.url;
	}

}
