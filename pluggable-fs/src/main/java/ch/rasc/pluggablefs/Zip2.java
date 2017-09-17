package ch.rasc.pluggablefs;

import java.io.IOException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.stream.Stream;

public class Zip2 {

	public static void main(String[] args) throws IOException {
		URI uri = URI.create("jar:file:///D:/ws/dacs/license-manager/target/license.jar");

		try (FileSystem fs = FileSystems.newFileSystem(uri, Collections.emptyMap())) {

			try (Stream<Path> paths = Files.walk(fs.getPath("/"))) {
				paths.filter(Files::isRegularFile).forEach(System.out::println);
			}
		}

	}

}
