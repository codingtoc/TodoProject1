import { LightningElement, track } from "lwc";
import getTodos from "@salesforce/apex/TodoController.getTodos";
import addTodo from "@salesforce/apex/TodoController.addTodo";
import updateTodo from "@salesforce/apex/TodoController.updateTodo";
import deleteTodo from "@salesforce/apex/TodoController.deleteTodo";
import LightningConfirm from "lightning/confirm";

export default class TodoList extends LightningElement {
  todos;
  isAddClicked = false;
  isEditClicked = false;
  recordId;
  subject;
  dueDate;
  isCompleted;
  isProcessing = false;

  connectedCallback() {
    this.isProcessing = true;
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
    } finally {
      this.isProcessing = false;
    }
  }

  handleRefresh(event) {
    this.isProcessing = true;
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
      this.isProcessing = true;
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
      this.isProcessing = false;
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
      this.isProcessing = true;
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
      this.isProcessing = false;
    }
  }

  async handleDelete(event) {
    this.recordId = event.target.dataset.recordId;
    const result = await LightningConfirm.open({
      message: "Are you sure you want to delete this todo?",
      variant: "default", // headerless
      label: "Delete Confirmation"
    });

    if (result) {
      try {
        this.isProcessing = true;
        let deleteResult = await deleteTodo({ recordId: this.recordId });
        this.getTodoList();
      } catch (error) {
        console.log(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }
}
