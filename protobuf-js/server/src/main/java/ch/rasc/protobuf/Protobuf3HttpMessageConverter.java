package ch.rasc.protobuf;

import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.protobuf.ExtensionRegistryInitializer;
import org.springframework.util.FileCopyUtils;

import com.google.protobuf.ExtensionRegistry;
import com.google.protobuf.Message;

public class Protobuf3HttpMessageConverter extends AbstractHttpMessageConverter<Message> {

	public static final MediaType PROTOBUF = new MediaType("application", "x-protobuf",
			StandardCharsets.UTF_8);

	private static final ConcurrentHashMap<Class<?>, Method> methodCache = new ConcurrentHashMap<>();

	private final ExtensionRegistry extensionRegistry = ExtensionRegistry.newInstance();

	/**
	 * Construct a new instance.
	 */
	public Protobuf3HttpMessageConverter() {
		this(null);
	}

	/**
	 * Construct a new instance with an {@link ExtensionRegistryInitializer} that allows
	 * the registration of message extensions.
	 */
	public Protobuf3HttpMessageConverter(
			ExtensionRegistryInitializer registryInitializer) {
		super(PROTOBUF);
		if (registryInitializer != null) {
			registryInitializer.initializeExtensionRegistry(this.extensionRegistry);
		}
	}

	@Override
	protected boolean supports(Class<?> clazz) {
		return Message.class.isAssignableFrom(clazz);
	}

	@Override
	protected MediaType getDefaultContentType(Message message) {
		return PROTOBUF;
	}

	@Override
	protected Message readInternal(Class<? extends Message> clazz,
			HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException {

		MediaType contentType = inputMessage.getHeaders().getContentType();
		if (contentType == null) {
			contentType = PROTOBUF;
		}
		Charset charset = contentType.getCharset();
		if (charset == null) {
			charset = StandardCharsets.UTF_8;
		}

		try {
			Message.Builder builder = getMessageBuilder(clazz);
			builder.mergeFrom(inputMessage.getBody(), this.extensionRegistry);
			return builder.build();
		}
		catch (Exception ex) {
			throw new HttpMessageNotReadableException(
					"Could not read Protobuf message: " + ex.getMessage(), ex);
		}
	}

	@Override
	protected void writeInternal(Message message, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {

		MediaType contentType = outputMessage.getHeaders().getContentType();
		if (contentType == null) {
			contentType = getDefaultContentType(message);
		}
		Charset charset = contentType.getCharset();
		if (charset == null) {
			charset = StandardCharsets.UTF_8;
		}

		if (PROTOBUF.isCompatibleWith(contentType)) {
			FileCopyUtils.copy(message.toByteArray(), outputMessage.getBody());
		}
	}

	/**
	 * Create a new {@code Message.Builder} instance for the given class.
	 * <p>
	 * This method uses a ConcurrentHashMap for caching method lookups.
	 */
	private static Message.Builder getMessageBuilder(Class<? extends Message> clazz)
			throws Exception {
		Method method = methodCache.get(clazz);
		if (method == null) {
			method = clazz.getMethod("newBuilder");
			methodCache.put(clazz, method);
		}
		return (Message.Builder) method.invoke(clazz);
	}

}
