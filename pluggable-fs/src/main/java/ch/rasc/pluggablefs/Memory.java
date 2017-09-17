package ch.rasc.pluggablefs;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import com.google.common.jimfs.Configuration;
import com.google.common.jimfs.Jimfs;

public class Memory {
	public static void main(String[] args) throws IOException {
		try (FileSystem fs = Jimfs.newFileSystem(Configuration.unix())) {
			Path p1 = fs.getPath("one.txt");
			List<String> lines = Arrays.asList("one", "two", "three");
			Files.write(p1, lines, StandardCharsets.UTF_8);

			Path p2 = fs.getPath("two.txt");
			Files.copy(p1, p2, StandardCopyOption.REPLACE_EXISTING);

			Path p2b = fs.getPath("two_renamed.txt");
			Files.move(p2, p2b, StandardCopyOption.REPLACE_EXISTING);

			Path dir = fs.getPath("directory");
			Files.createDirectory(dir);

			Path p3 = fs.getPath("directory/three.txt");
			Files.write(p3, Arrays.asList("three"));

			Files.delete(p1);

			try (Stream<Path> paths = Files.walk(fs.getPath("/"))) {
				paths.filter(Files::isRegularFile).forEach(System.out::println);
			}
		}
	}
}
