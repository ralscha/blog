package ch.rasc.sseclient;

import com.launchdarkly.eventsource.EventHandler;

public interface DefaultEventHandler extends EventHandler {

	@Override
	default void onOpen() throws Exception {
		// nothing here
	}

	@Override
	default void onClosed() throws Exception {
		// nothing here
	}

	@Override
	default void onComment(String comment) throws Exception {
		// nothing here
	}

	@Override
	default void onError(Throwable t) {
		// nothing here
	}

}
