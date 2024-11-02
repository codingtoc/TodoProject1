import { LightningElement, track } from "lwc";
import getTodos from "@salesforce/apex/TodoController.getTodos";
import addTodo from "@salesforce/apex/TodoController.addTodo";
import updateTodo from "@salesforce/apex/TodoController.updateTodo";
export default class TodoList extends LightningElement {
  todos;
  isAddClicked = false;
  isEditClicked = false;
  recordId;
  subject;
  dueDate;
  isCompleted;

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

  handleAdd(event) {
    this.isAddClicked = true;
  }

  handleAddCancel(event) {
    this.isAddClicked = false;
  }

  handleChangeSubject(event) {
    this.subject = event.target.value;
  }

  handleChangeDueDate(event) {
    this.dueDate = event.target.value;
  }

  handleChangeIsCompleted(event) {
    this.isCompleted = event.target.checked;
  }

  async handleAddSave(event) {
    if (this.subject.trim() === "") {
      this.subject = "";
      return;
    }
    try {
      let todo = await addTodo({
        subject: this.subject,
        activityDate: this.dueDate,
        isCompleted: this.isCompleted
      });
      this.getTodoList();
    } catch (error) {
      console.log(error);
    } finally {
      this.isAddClicked = false;
    }
  }

  handleEdit(event) {
    this.recordId = event.target.dataset.recordId;
    this.subject = event.target.dataset.subject;
    this.dueDate = event.target.dataset.dueDate;
    this.isCompleted = event.target.dataset.isCompleted === "true";
    this.isEditClicked = true;
  }

  handleEditCancel(event) {
    this.isEditClicked = false;
  }

  async handleEditSave(event) {
    if (this.subject.trim() === "") {
      this.subject = "";
      return;
    }
    try {
      let todo = await updateTodo({
        todo: {
          Id: this.recordId,
          Subject: this.subject,
          ActivityDate: this.dueDate,
          Status: this.isCompleted ? "Completed" : "Not Started"
        }
      });
      this.getTodoList();
    } catch (error) {
      console.log(error);
    } finally {
      this.isEditClicked = false;
    }
  }
}
