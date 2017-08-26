package ch.rasc.swagger.todo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todo")
@CrossOrigin
public class TodoController {

	private final TodoDb todoDb;

	public TodoController(TodoDb todoDb) {
		this.todoDb = todoDb;
	}

	@PostMapping("/save")
	public boolean save(@RequestBody Todo todo) {
		this.todoDb.save(todo);
		return true;
	}

	@PostMapping("/delete/{id}")
	public boolean delete(@PathVariable("id") String id) {
		this.todoDb.delete(id);
		return true;
	}

	@GetMapping("/list")
	public List<Todo> list() {
		return new ArrayList<>(this.todoDb.list());
	}
}