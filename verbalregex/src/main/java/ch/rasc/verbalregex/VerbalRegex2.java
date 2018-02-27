package ch.rasc.verbalregex;

import ru.lanwen.verbalregex.VerbalExpression;

public class VerbalRegex2 {

	public static void main(String[] args) {
				
		VerbalExpression regex = VerbalExpression.regex()
				 .startOfLine()
				 .range("1", "9").count(3).range("a", "z").count(2)
				 .then("-")
				 .range("a", "z").count(2)
				 .then("-")
				 .range("1", "9").count(3).range("a", "z").count(2)
				 .endOfLine()
				 .build();

		String input = "123xy-ab-311de";
		System.out.println(regex.test(input));
		
		
		VerbalExpression.Builder part = VerbalExpression.regex().range("1", "9").count(3).range("a", "z").count(2);
		regex = VerbalExpression.regex()
				 .startOfLine()
				 .add(part)
				 .then("-")
				 .range("a", "z").count(2)
				 .then("-")
				 .add(part)
				 .endOfLine()
				 .build();

		System.out.println(regex.test(input));
	}

}
