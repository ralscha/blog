package ch.rasc.sync;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class TodoService {

  private final Map<String, Todo> todoDb = new HashMap<>();

  @GetMapping("syncview")
  public Map<String, Long> getSyncView() {
    Map<String, Long> result = new HashMap<>();
    this.todoDb.values().forEach(todo -> result.put(todo.getId(), todo.getTs()));
    return result;
  }

  @PostMapping("sync")
  public SyncResponse sync(@RequestBody SyncRequest sync) {
    SyncResponse response = new SyncResponse();

    if (sync.getRemove() != null) {
      Set<String> removed = new HashSet<>();
      for (String id : sync.getRemove()) {
        this.todoDb.remove(id);
        removed.add(id);
      }
      response.setRemoved(removed);
    }

    List<Todo> gets = new ArrayList<>();

    if (sync.getUpdate() != null) {
      Map<String, Long> updated = new HashMap<>();
      for (Todo todo : sync.getUpdate()) {
        if (todo.getTs() > 0) {
          // update
          Todo dbTodo = this.todoDb.get(todo.getId());
          if (dbTodo.getTs() > todo.getTs()) {
            // db todo is newer than the version sent from the client
            gets.add(dbTodo);
          }
          else {
            this.todoDb.put(todo.getId(), todo);
            updated.put(todo.getId(), todo.getTs());
          }
        }
        else {
          // insert
          todo.setTs(System.currentTimeMillis());
          this.todoDb.put(todo.getId(), todo);
          updated.put(todo.getId(), todo.getTs());
        }
      }
      response.setUpdated(updated);
    }

    if (sync.getGet() != null) {
      for (String id : sync.getGet()) {
        gets.add(this.todoDb.get(id));
      }
    }

    if (!gets.isEmpty()) {
      response.setGet(gets);
    }

    return response;
  }

}
