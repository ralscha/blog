package ch.rasc.verbalregex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Native {

	public static void main(String[] args) {
		String[] inputs = new String[] { "AB-0.z", "ABC-99.y", "BB-789.x", "ab-999.x" };

		Pattern pattern = Pattern.compile("^([A-Z]{2,3})-(\\d{1,3})\\.([xyz])");

		for (String input : inputs) {
			Matcher matcher = pattern.matcher(input);
			if (matcher.matches()) {
				System.out.printf("Group 1: %s, Group 2: %s, Group 3: %s%n",
						matcher.group(1), matcher.group(2), matcher.group(3));
			}
			else {
				System.out.println(input + " does not match");
			}
		}
	}
}
