package ch.rasc.pluggablefs;

import java.io.IOException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Zip3 {

	public static void main(String[] args) throws IOException {
		Map<String, String> env = new HashMap<>();
		env.put("create", "true");
		URI uri1 = URI.create("jar:file:/test1.zip");
		URI uri2 = URI.create("jar:file:/test2.zip");

		try (FileSystem fs1 = FileSystems.newFileSystem(uri1, Collections.emptyMap());
				FileSystem fs2 = FileSystems.newFileSystem(uri2, env)) {
			Path p1 = fs1.getPath("two_renamed.txt");
			Path p2 = fs2.getPath("copy.txt");
			Files.copy(p1, p2);
		}
	}

}
