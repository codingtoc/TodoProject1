import { LightningElement } from "lwc";
import getTodos from "@salesforce/apex/TodoController.getTodos";

export default class TodoList extends LightningElement {
  todos;

  connectedCallback() {
    this.getTodoList();
  }

  async getTodoList() {
    try {
      const todoList = await getTodos();
      this.todos = todoList.map((todo) => {
        return { ...todo, IsCompleted: todo.Status === "Completed" };
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleRefresh(event) {
    this.getTodoList();
  }
}
