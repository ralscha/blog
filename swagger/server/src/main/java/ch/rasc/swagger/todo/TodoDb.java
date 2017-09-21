package ch.rasc.swagger.todo;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class TodoDb {

	private final Map<String, Todo> todos = new HashMap<>();

	public void save(Todo todo) {
		this.todos.put(todo.getId(), todo);
	}

	public void delete(String id) {
		this.todos.remove(id);
	}

	public Collection<Todo> list() {
		return this.todos.values();
	}

}
