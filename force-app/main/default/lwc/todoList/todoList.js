import { LightningElement } from "lwc";
import getTodos from "@salesforce/apex/TodoController.getTodos";
import addTodo from "@salesforce/apex/TodoController.addTodo";
import updateTodo from "@salesforce/apex/TodoController.updateTodo";
import deleteTodo from "@salesforce/apex/TodoController.deleteTodo";
import LightningConfirm from "lightning/confirm";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ModalPopup from "c/modalPopup";

export default class TodoList extends LightningElement {
  todos;
  recordId;
  subject;
  dueDate;
  isCompleted = false;
  isProcessing = false;
  searchText;
  status = "All";

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
    this.showToast("Refresh Todo List", "Todo List is refreshed successfully.");
  }

  async handleModalPopup(event) {
    this.recordId = event.target.dataset.recordId;
    this.subject = event.target.dataset.subject;
    this.dueDate = event.target.dataset.dueDate;
    this.isCompleted = event.target.dataset.isCompleted === "true";

    const result = await ModalPopup.open({
      todo: {
        recordId: this.recordId,
        subject: this.subject,
        dueDate: this.dueDate,
        isCompleted: this.isCompleted
      }
    });

    if (result) {
      this.recordId = result.recordId;
      this.subject = result.subject;
      this.dueDate = result.dueDate;
      this.isCompleted = result.isCompleted;
      if (this.recordId) {
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
          this.showToast("Edit Todo", "Todo is updated successfully.");
        } catch (error) {
          console.log(error);
        } finally {
          this.isProcessing = false;
          this.initTodo();
        }
      } else {
        try {
          this.isProcessing = true;
          let todo = await addTodo({
            subject: this.subject,
            activityDate: this.dueDate,
            isCompleted: this.isCompleted
          });
          this.getTodoList();
          this.showToast("Add Todo", "Todo is inserted successfully.");
        } catch (error) {
          console.log(error);
        } finally {
          this.isProcessing = false;
          this.initTodo();
        }
      }
    } else {
      this.initTodo();
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
        this.showToast("Delete Todo", "Todo is deleted successfully.");
      } catch (error) {
        console.log(error);
      } finally {
        this.isProcessing = false;
        this.initTodo();
      }
    } else {
      this.initTodo();
    }
  }

  initTodo() {
    this.recordId = null;
    this.subject = null;
    this.dueDate = null;
    this.isCompleted = false;
  }

  showToast(title, message) {
    const event = new ShowToastEvent({
      title: title,
      message: message
    });
    this.dispatchEvent(event);
  }

  handleSearchText(event) {
    this.searchText = event.detail;
  }

  handleStatus(event) {
    this.status = event.detail;
  }
}
