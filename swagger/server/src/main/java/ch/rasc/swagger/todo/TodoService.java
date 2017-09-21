package ch.rasc.swagger.todo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/todo")
@CrossOrigin
public class TodoService {

	private final TodoDb todoDb;

	public TodoService(TodoDb todoDb) {
		this.todoDb = todoDb;
	}

	@PostMapping("/save")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void save(@RequestBody Todo todo) {
		this.todoDb.save(todo);
	}

	@PostMapping("/delete/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@ApiOperation("Deletes a todo entry")
	public void delete(@ApiParam(value = "Primary key of the todo entity",
			required = true) @PathVariable("id") String id) {
		this.todoDb.delete(id);
	}

	@GetMapping("/list")
	public List<Todo> list() {
		return new ArrayList<>(this.todoDb.list());
	}
}